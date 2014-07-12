/*jshint bitwise: false*/
'use strict';

// custome static entity
function StaticEntity() {
    this.name = 'staticEntity';
}

// Core of the engine, responsible for game loop and processing system entities
// -----------------------------------------
window.CONV = (function () {
    var TICKS_PER_SECOND = 25,
        SKIP_TICKS = 1000 / TICKS_PER_SECOND,
        MAX_FRAMESKIP = 5,
        tempLogicSystems = [],
        tempInterpolationSystems = [],
        tempIOSystems = [],
        systemsByName = {},
        staticEntity = new StaticEntity(),    // create new entity composing only of static systems
        firstLogicCallback,
        firstInterpolationCallback,
        firstIOCallback,
        loops = 0,
        interpolation,
        nextGameTick;

    // Private
    // --------------------------
    function systemIndex(systems, systemName) {
        return _.findIndex(systems, function (system) {
            return system.name === systemName;
        });
    }

    function registerSystem(systemCollection, system) {
        if (systemsByName[system.name]) {
            throw new Error('system under name "' + system.name + '" already exists');
        }

        _.each(system.dependencies, function (depName) {
            if (depName === system.name) {
                throw new Error('system cannot depend on it self');
            }
        });

        systemCollection.push(system);
        systemsByName[system.name] = system;

        // static systems enjoy their own component
        if(system.isStatic) {
            staticEntity[system.name] = system.component();
        }

        return system;
    }

    function unregisterSystem(systemCollection, system) {
        if (system.entities.length) {
            throw new Error('entities still using this system, please remove dependent entities before removing the system');
        }

        var sys = systemsByName[system.name];

        delete systemsByName[system.name];
        systemCollection.splice(systemCollection.indexOf(sys), 1); // remove system
    }

    // adds system and it dependencies in order
    // returns system index
    function addSystem(tempSystemCollection, systemCollection, tempSys) {
        var sysIndex = systemIndex(systemCollection, tempSys.name);

        // do nothing if system already exists
        if (sysIndex !== -1) {
            return sysIndex;
        }

        _.each(tempSys.dependencies, function (depSysName) {
            var depSys = systemsByName[depSysName]; // resolve dependency

            // do nothing if system is missing
            if (!depSys) {
                return;
            }

            // continue loop if dependency system not found but exists in the engine
            // because it may be system of different type(eg. IO system inside of Logic system)
            if (depSys && !_.findWhere(tempSystemCollection, {
                name: depSysName
            })) {
                return;
            }

            // add system
            addSystem(tempSystemCollection, systemCollection, depSys);
        });

        sysIndex = 0;

        // calculate the index of the system according to it dependencies
        _.each(tempSys.dependencies, function (depSysName) {
            sysIndex += 1 + systemIndex(systemCollection, depSysName);
        });

        // TODO: rise event telling that "system finish loading(tempSys)";
        systemCollection.splice(sysIndex, 0, tempSys); // add system it self

        return sysIndex;
    }

    function validateSystemDependencies(tempSysDependencies, isStatic) {
        // iterate the dependencies and validate their correctness
        _.each(tempSysDependencies, function (depSysName) {
            var depSys = systemsByName[depSysName]; // resolve dependency

            // do nothing is dependency system is not found
            if (!depSys) {
                return;
            }

            // throw exception if static system has non-static system as dependency
            if (isStatic && !depSys.isStatic) {
                throw new Error('Static system can\'t have non-static system as required dependency');
            }

            validateSystem(depSys);
        });
    }

    function validateSystemRequiredDependencies(tempSysDependencies) {
        _.each(tempSysDependencies, function (depSysName) {
            var depSys = systemsByName[depSysName]; // resolve dependency

            // throw exception if dependency system doesn't exists
            if (!depSys) {
                throw new Error('Dependency system "' + depSysName + '" not found');
            }
        });
    }

    // validates system to meet certain criteria, will throw exception if doesn't
    function validateSystem(tempSys) {
        validateSystemDependencies(tempSys.dependencies, tempSys.isStatic);
        validateSystemRequiredDependencies(tempSys.requiredDependencies);
    }

    // goes over all systems and validates them
    function validateSystems(tempSystemCollection) {
        // add systems in the correct order for dependencies
        _.each(tempSystemCollection, function (tempSys) {
            validateSystem(tempSys);
        });
    }

    function prepareSystem(tempSystemCollection, lastYield) {
        if (!tempSystemCollection.length) {
            return lastYield;
        }

        var systemCollection = [],
            constructCallbacks;

        // add systems in the correct order for dependencies
        _.each(tempSystemCollection, function (tempSys) {
            addSystem(tempSystemCollection, systemCollection, tempSys);
        });

        constructCallbacks = function (sys, i) {
            if (!sys) {
                return lastYield;
            }

            i++;
            var nextCallback = constructCallbacks(systemCollection[i], i);
            sys.yield = nextCallback;

            // if system static pass only the static entity else pass all entities
            var processEntities = sys.isStatic ? staticEntity : sys.entities;

            return function () {
                sys.process(processEntities, interpolation); // process system
                
                // yield if not threaded system
                if (!sys.thread) {
                    sys.yield();
                }
            };
        };

        return constructCallbacks(_.first(systemCollection), 0);
    }

    // returns complete list of entity components
    function inflateEntityComponents(requiredComponents) {
        var componentNames = _.inject(requiredComponents, function (componentsList, componentName) {
            var system = systemsByName[componentName];

            // throw exception if dependency system doesn't exists
            if (!system) {
                throw new Error('System "' + componentName + '" not found');
            }

            return componentsList
                    .concat(system.requiredDependencies)
                    .concat(inflateEntityComponents(system.requiredDependencies));
        }, requiredComponents);

        return _.uniq(componentNames);
    }

    // register components with systems and returns collection of components
    function registerComponents(entity, componentNames) {
        return _.inject(componentNames, function (components, componentName) {
            var system = systemsByName[componentName];

            system.entities.push(entity);

            components[componentName] = system.component(entity.components[componentName]);
            return components;
        }, {});
    }

    // unregisters components with systems
    function unregisterComponents(entity, componentNames) {
        _.each(componentNames, function (componentName) {
            var system = systemsByName[componentName];

            // find index of entity inside of system's entities
            var entityIndex = system.entities.indexOf(entity);

            // remove entity from system only if its found
            system.entities.splice(entityIndex, 1);
        });
    }

    // cycling over all logic systems and processing them
    function processLogic() {
        interpolation = null;

        var performanceNow = window.performance.now();

        if (performanceNow >= nextGameTick) {
            // if we overflowed the max loops there is no point to get back
            if (loops >= MAX_FRAMESKIP) {
                nextGameTick = performanceNow;
            } else {
                nextGameTick += SKIP_TICKS;
                loops++;
                firstLogicCallback();
                    
                return;
            }
        }

        loops = 0;

        processInterpolation();
    }

    // cycling over all interpolation systems and processing them passing interpolation to each
    function processInterpolation() {
        interpolation = (window.performance.now() + SKIP_TICKS - nextGameTick) / SKIP_TICKS;
        firstInterpolationCallback();
    }

    // cycling over all input/output systems
    function processIO() {
        firstIOCallback();
    }

    // start processing chain from processLogic callback
    function processNextFrame() {
        window.requestAnimationFrame(processLogic);
    }

    // Public
    // --------------------------

    // pushes system to array in the correct spot according to dependencies
    function registerLogicSystem(system) {
        return registerSystem(tempLogicSystems, system);
    }

    function unregisterLogicSystem(system) {
        return unregisterSystem(tempLogicSystems, system);
    }

    function registerInterpolateSystem(system) {
        return registerSystem(tempInterpolationSystems, system);
    }

    function unregisterInterpolateSystem(system) {
        return unregisterSystem(tempInterpolationSystems, system);
    }

    function registerIOSystem(system) {
        return registerSystem(tempIOSystems, system);
    }

    function unregisterIOSystem(system) {
        return unregisterSystem(tempIOSystems, system);
    }

    // add new entity
    function registerEntity(entity) {
        var componentNames = inflateEntityComponents(_.keys(entity.components)),
            components = registerComponents(entity, componentNames);

        return _.extend(entity, components);
    }

    function unregisterEntity(entity) {
        // get componentNames only
        var componentNames = _(entity).keys().without('name', 'components').value();

        unregisterComponents(entity, componentNames);
    }

    function updateEntity(entity) {
        var oldComponents = _(entity).keys().without('name', 'components').value(),
            newComponents = inflateEntityComponents(_.keys(entity.components)),
            removedComponents = _.difference(oldComponents, newComponents),
            addedComponents = _.difference(newComponents, oldComponents);

        // remove unused components by the entity
        unregisterComponents(entity, removedComponents);
        _.each(removedComponents, function(componentName) {
            delete entity[componentName];
        });

        // add newly used components
        var components = registerComponents(entity, addedComponents);

        return _.extend(entity, components);
    }

    function mainLoop() {
        nextGameTick = window.performance.now();
        
        validateSystems(tempLogicSystems);
        validateSystems(tempInterpolationSystems);
        validateSystems(tempIOSystems);

        firstLogicCallback = prepareSystem(tempLogicSystems, processLogic);
        firstInterpolationCallback = prepareSystem(tempInterpolationSystems, processIO);
        firstIOCallback = prepareSystem(tempIOSystems, processNextFrame);

        processNextFrame();
    }

    mainLoop._registerLogicSystem = registerLogicSystem;
    mainLoop._unregisterLogicSystem = unregisterLogicSystem;
    mainLoop._registerIOSystem = registerIOSystem;
    mainLoop._unregisterIOSystem = unregisterIOSystem;
    mainLoop._registerInterpolateSystem = registerInterpolateSystem;
    mainLoop._unregisterInterpolateSystem = unregisterInterpolateSystem;
    mainLoop._registerEntity = registerEntity;
    mainLoop._unregisterEntity = unregisterEntity;
    mainLoop._updateEntity = updateEntity;
    mainLoop.TICKS_PER_SECOND = TICKS_PER_SECOND;
    mainLoop.SKIP_TICKS = SKIP_TICKS;
    mainLoop.MAX_FRAMESKIP = MAX_FRAMESKIP;
    return mainLoop;
})();