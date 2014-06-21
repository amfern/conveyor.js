/*jshint bitwise: false*/
'use strict';

// Core of the engine, responsible for game loop and processing system entities
// -----------------------------------------
window.COMP = (function () {
    var TICKS_PER_SECOND = 25,
        SKIP_TICKS = 1000 / TICKS_PER_SECOND,
        MAX_FRAMESKIP = 5,
        tempLogicSystems = [],
        tempInterpolationSystems = [],
        tempIOSystems = [],
        systemsByName = {},
        firstLogicCallback,
        firstInterpolationCallback,
        firstIOCallback,
        loops = 0,
        interpolation,
        nextGameTick,
        staticEntity;

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

        return system;
    }

    function unregisterSystem(systemCollection, system) {
        if (system.entities.length) {
            throw new Error('entities still using this system, please remove dependent entities before removing the system');
        }

        var sys = systemsByName[system.name];
        
        if (!sys) {
            return;
        }

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

    // adds entity and it dependencies in order
    function addEntityComponents(entity, requiredComponents) {
        _.each(requiredComponents, function (componentName) {
            // do nothing if component already exists
            if (entity[componentName]) {
                return;
            }

            var system = systemsByName[componentName];

            // throw exception if dependency system doesn't
            if (!system) {
                throw new Error('System "' + componentName + '" not found');
            }

            entity[system.name] = system.component();

            // static systems require only other static systems components
            if (!system.isStatic) {
                system.entities.push(entity);
            }

            addEntityComponents(entity, system.requiredDependencies);
        });
    }

    // updates entity and it components
    function updateEntityComponents(oldEntity, newEntity, requiredComponents) {
        _.each(requiredComponents, function (componentName) {
            var system = systemsByName[componentName];
            
            // dependency not found
            if (!system) {
                return;
            }

            var oldEntityComponent = oldEntity[componentName];
            
            // if oldEntity already have that components, use it instead of creating new one
            if (oldEntityComponent) {
                newEntity[componentName] = oldEntityComponent;

                // delete component from old entity
                delete oldEntity[componentName];

                // replace old entity with new one
                system.entities.splice(system.entities.indexOf(oldEntity), 1, newEntity);

                updateEntityComponents(oldEntity, newEntity, system.requiredDependencies);
            } else {
                addEntityComponents(newEntity, system.requiredDependencies);
            }
        });
    }

    // removes systems
    function removeEntityComponents(entity, requiredComponents) {
        _.each(requiredComponents, function (componentName) {
            var system = systemsByName[componentName];

            if (!system) {
                return;
            } // dependency not found

            delete entity[componentName]; // remove component from entity

            // find index of entity inside of system's entities
            var entityIndex = system.entities.indexOf(entity);

            // remove entity from system only if its found
            // (it could have been remove before)
            if (~entityIndex) {
                system.entities.splice(entityIndex, 1);
            }

            removeEntityComponents(entity, system.requiredDependencies);
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

    // constructs entity only for static systems to use
    function constructStaticEntity() {
        // filter only static systems
        var staticSystems = _.filter(systemsByName, function (sys) {
            return sys.isStatic;
        });

        // collect only static system names
        staticSystems = _.map(staticSystems, function (sys) {
            return sys.name;
        });

        // create new entity composing only of static systems
        var staticEntity = new COMP.StaticEntity({
            name: 'staticEntity',
            components: staticSystems,
        });

        return staticEntity;
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
        addEntityComponents(entity, entity.components);
    }

    function unregisterEntity(entity) {
        removeEntityComponents(entity, entity.components);
    }

    function updateEntity(entity) {
        var newEntity = new COMP.Entity({
            name: entity.name
        });
        newEntity.components = entity.components;
        updateEntityComponents(entity, newEntity, newEntity.components);

        // remove other components
        removeEntityComponents(entity, _.keys(entity));

        return newEntity;
    }

    // clear all entities of all systems
    function clearEntities() {
        _.each(systemsByName, function (sys) {
            sys.entities = [];
        });
    }

    // clear all systems(which clears entities also)
    function clearSystems() {
        tempLogicSystems = [];
        tempInterpolationSystems = [];
        tempIOSystems = [];
        systemsByName = {};
    }


    function mainLoop() {
        nextGameTick = window.performance.now();

        validateSystems(tempLogicSystems, processLogic);
        validateSystems(tempInterpolationSystems, processIO);
        validateSystems(tempIOSystems, processNextFrame);

        staticEntity = constructStaticEntity();

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
    mainLoop._clearEntities = clearEntities;
    mainLoop._clearSystems = clearSystems;
    mainLoop.TICKS_PER_SECOND = TICKS_PER_SECOND;
    mainLoop.SKIP_TICKS = SKIP_TICKS;
    mainLoop.MAX_FRAMESKIP = MAX_FRAMESKIP;
    return mainLoop;
})();