'use strict';

describe('System', function () {
    var genericSystem, config;

    beforeEach(function () {
        spyOn(COMP, '_registerLogicSystem');
        spyOn(COMP, '_unregisterLogicSystem');
        spyOn(COMP, '_registerInterpolateSystem');
        spyOn(COMP, '_unregisterInterpolateSystem');
        spyOn(COMP, '_registerIOSystem');
        spyOn(COMP, '_unregisterIOSystem');
    });

    it('should register logic system with core', function () {
        config = {
            name: 'EpicLogicSystem',
            dependencies: [],
            thread: true,
            component: function () {},
            process: function () {}
        };

        genericSystem = new COMP.System.Logic(config);
        expect(COMP._registerLogicSystem.mostRecentCall.args[0]).toMatch({
            name: 'EpicLogicSystem',
            isStatic: false,
            dependencies: [],
            component: config.component,
            thread: true,
            process: config.process,
            entities: []
        });
    });

    it('should register Interpolate system with core', function () {
        config = {
            name: 'EpicInterplateSystem',
            dependencies: [],
            component: function () {},
            process: function () {}
        };

        genericSystem = new COMP.System.Interpolate(config);
        expect(COMP._registerInterpolateSystem.mostRecentCall.args[0]).toMatch({
            name: 'EpicInterplateSystem',
            isStatic: false,
            dependencies: [],
            component: config.component,
            thread: false,
            process: config.process,
            entities: []
        });
    });

    it('should register IO system with core', function () {
        config = {
            name: 'EpicIOSystem',
            dependencies: [],
            component: function () {},
            process: function () {}
        };

        genericSystem = new COMP.System.IO(config);
        expect(COMP._registerIOSystem.mostRecentCall.args[0]).toMatch({
            name: 'EpicIOSystem',
            isStatic: false,
            dependencies: [],
            component: config.component,
            thread: false,
            process: config.process,
            entities: []
        });
    });

    it('should raise exception for system name == "name"', function () {
        expect(COMP.System.bind(null, {
            name: 'name'
        })).toThrow('"name" is saved system name');
    });

    it('should raise exception for system name == "dependencies"', function () {
        expect(COMP.System.bind(null, {
            name: 'dependencies'
        })).toThrow('"dependencies" is saved system name');
    });

    it('should raise exception for system name == "entities"', function () {
        expect(COMP.System.bind(null, {
            name: 'entities'
        })).toThrow('"entities" is saved system name');
    });

    it('should raise exception for system name == "component"', function () {
        expect(COMP.System.bind(null, {
            name: 'component'
        })).toThrow('"component" is saved system name');
    });

    it('should raise exception for system name == "process"', function () {
        expect(COMP.System.bind(null, {
            name: 'process'
        })).toThrow('"process" is saved system name');
    });

    it('should raise exception for system name == "yield"', function () {
        expect(COMP.System.bind(null, {
            name: 'yield'
        })).toThrow('"yield" is saved system name');
    });

    it('should raise exception for missing process function', function () {
        expect(COMP.System.bind(null, {
            name: 'epicName'
        })).toThrow('process function is mandatory');
    });

    it('should raise exception for missing name', function () {
        expect(COMP.System.bind(null, {
            process: function () {}
        })).toThrow('empty system name is not allowed');
    });

    describe('new system', function () {
        beforeEach(function () {
            config = {
                name: 'epicGenericName',
                process: function () {}
            };

            genericSystem = new COMP.System(config);
        });

        it('should fill default dependencies', function () {
            expect(genericSystem.dependencies).toEqual([]);
        });

        it('should fill default component function', function () {
            expect(typeof (genericSystem.component)).toEqual('function');
        });
    });

    it('should unregister logic system with core', function () {
        config = {
            name: 'UnregisterEpicLogicSystem',
            dependencies: [],
            thread: true,
            component: function () {},
            process: function () {}
        };

        genericSystem = new COMP.System.Logic(config);
        genericSystem.remove();
        expect(COMP._unregisterLogicSystem).toHaveBeenCalledWith(genericSystem);
    });

    it('should unregister Interpolate system with core', function () {
        config = {
            name: 'UnregisterEpicInterpolateSystem',
            dependencies: [],
            thread: true,
            component: function () {},
            process: function () {}
        };

        genericSystem = new COMP.System.Interpolate(config);
        genericSystem.remove();
        expect(COMP._unregisterInterpolateSystem).toHaveBeenCalledWith(genericSystem);
    });

    it('should unregister IO system with core', function () {
        config = {
            name: 'UnregisterEpicIOSystem',
            dependencies: [],
            thread: true,
            component: function () {},
            process: function () {}
        };

        genericSystem = new COMP.System.IO(config);
        genericSystem.remove();
        expect(COMP._unregisterIOSystem).toHaveBeenCalledWith(genericSystem);
    });
});