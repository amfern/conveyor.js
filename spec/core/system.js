'use strict';

describe('System', function () {
    var genericSystem, config;

    beforeEach(function () {
        spyOn(CONV, '_registerLogicSystem');
        spyOn(CONV, '_unregisterLogicSystem');
        spyOn(CONV, '_registerInterpolateSystem');
        spyOn(CONV, '_unregisterInterpolateSystem');
        spyOn(CONV, '_registerIOSystem');
        spyOn(CONV, '_unregisterIOSystem');
    });

    it('should register logic system with core', function () {
        config = {
            name: 'EpicLogicSystem',
            requiredDependencies: [],
            thread: true,
            component: function () {},
            process: function () {}
        };

        genericSystem = new CONV.System.Logic(config);
        expect(CONV._registerLogicSystem.calls.allArgs()[0]).toMatch({
            name: 'EpicLogicSystem',
            isStatic: false,
            requiredDependencies: [],
            component: config.component,
            thread: true,
            process: config.process,
            entities: []
        });
    });

    it('should register Interpolate system with core', function () {
        config = {
            name: 'EpicInterplateSystem',
            requiredDependencies: [],
            component: function () {},
            process: function () {}
        };

        genericSystem = new CONV.System.Interpolate(config);
        expect(CONV._registerInterpolateSystem.calls.allArgs()[0]).toMatch({
            name: 'EpicInterplateSystem',
            isStatic: false,
            requiredDependencies: [],
            component: config.component,
            thread: false,
            process: config.process,
            entities: []
        });
    });

    it('should register IO system with core', function () {
        config = {
            name: 'EpicIOSystem',
            requiredDependencies: [],
            component: function () {},
            process: function () {}
        };

        genericSystem = new CONV.System.IO(config);
        expect(CONV._registerIOSystem.calls.allArgs()[0]).toMatch({
            name: 'EpicIOSystem',
            isStatic: false,
            requiredDependencies: [],
            component: config.component,
            thread: false,
            process: config.process,
            entities: []
        });
    });

    it('should register system with core, and unify requiredDependencies with dependencies', function () {
        config = {
            name: 'EpicSystem',
            requiredDependencies: ['EpicIORequiredSystem1', 'EpicIORequiredSystem2'],
            dependencies: ['EpicIORequiredSystem2', 'EpicIORequiredSystem3'],
            component: function () {},
            process: function () {}
        };

        genericSystem = new CONV.System.IO(config);
        expect(CONV._registerIOSystem.calls.allArgs()[0]).toMatch({
            name: 'EpicSystem',
            isStatic: false,
            requiredDependencies: ['EpicIORequiredSystem1', 'EpicIORequiredSystem2'],
            dependencies: [
                'EpicIORequiredSystem1',
                'EpicIORequiredSystem2',
                'EpicIORequiredSystem3'
            ],
            component: config.component,
            thread: false,
            process: config.process,
            entities: []
        });

        genericSystem = new CONV.System.Logic(config);
        expect(CONV._registerLogicSystem.calls.allArgs()[0]).toMatch({
            name: 'EpicSystem',
            isStatic: false,
            requiredDependencies: ['EpicIORequiredSystem1', 'EpicIORequiredSystem2'],
            dependencies: [
                'EpicIORequiredSystem1',
                'EpicIORequiredSystem2',
                'EpicIORequiredSystem3'
            ],
            component: config.component,
            thread: false,
            process: config.process,
            entities: []
        });
    });

    it('should raise exception for system name == "name"', function () {
        expect(CONV.System.bind(null, {
            name: 'name'
        })).toThrow(new Error('"name" is saved system name'));
    });

    it('should raise exception for system name == "dependencies"', function () {
        expect(CONV.System.bind(null, {
            name: 'dependencies'
        })).toThrow(new Error('"dependencies" is saved system name'));
    });

    it('should raise exception for system name == "entities"', function () {
        expect(CONV.System.bind(null, {
            name: 'entities'
        })).toThrow(new Error('"entities" is saved system name'));
    });

    it('should raise exception for system name == "component"', function () {
        expect(CONV.System.bind(null, {
            name: 'component'
        })).toThrow(new Error('"component" is saved system name'));
    });

    it('should raise exception for system name == "process"', function () {
        expect(CONV.System.bind(null, {
            name: 'process'
        })).toThrow(new Error('"process" is saved system name'));
    });

    it('should raise exception for system name == "yield"', function () {
        expect(CONV.System.bind(null, {
            name: 'yield'
        })).toThrow(new Error('"yield" is saved system name'));
    });

    it('should raise exception for missing process function', function () {
        expect(CONV.System.bind(null, {
            name: 'epicName'
        })).toThrow(new Error('process function is mandatory'));
    });

    it('should raise exception for missing name', function () {
        expect(CONV.System.bind(null, {
            process: function () {}
        })).toThrow(new Error('empty system name is not allowed'));
    });

    describe('new system', function () {
        beforeEach(function () {
            config = {
                name: 'epicGenericName',
                process: function () {}
            };

            genericSystem = new CONV.System(config);
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
            requiredDependencies: [],
            thread: true,
            component: function () {},
            process: function () {}
        };

        genericSystem = new CONV.System.Logic(config);
        genericSystem.remove();
        expect(CONV._unregisterLogicSystem).toHaveBeenCalledWith(genericSystem);
    });

    it('should unregister Interpolate system with core', function () {
        config = {
            name: 'UnregisterEpicInterpolateSystem',
            requiredDependencies: [],
            thread: true,
            component: function () {},
            process: function () {}
        };

        genericSystem = new CONV.System.Interpolate(config);
        genericSystem.remove();
        expect(CONV._unregisterInterpolateSystem).toHaveBeenCalledWith(genericSystem);
    });

    it('should unregister IO system with core', function () {
        config = {
            name: 'UnregisterEpicIOSystem',
            requiredDependencies: [],
            thread: true,
            component: function () {},
            process: function () {}
        };

        genericSystem = new CONV.System.IO(config);
        genericSystem.remove();
        expect(CONV._unregisterIOSystem).toHaveBeenCalledWith(genericSystem);
    });
});