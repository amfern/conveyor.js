'use strict';

describe('core register systems', function () {
    var systemLogic1, systemLogic2, systemLogic3, systemLogic4, systemLogic5, systemLogic6, systemLogic7, systemLogic8, systemLogic9,
        systemStaticLogic1, systemStaticLogic2,
        systemInterpolation1, systemInterpolation2, systemInterpolation3, systemInterpolation4, systemInterpolation5, systemInterpolation6, systemInterpolation7, systemInterpolation8, systemInterpolation9,
        systemStaticInterpolation1, systemStaticInterpolation2,
        systemIO1, systemIO2, systemIO3, systemIO4, systemIO5, systemIO6, systemIO7, systemIO8, systemIO9,
        systemStaticIO1, systemStaticIO2,
        entity1, entity2, entity3, entity4, entity5, entity6, entity7,
        systemExecutionPattern = [],
        componentExecutionPattern = [];

    // add systems
    beforeEach(function () {
        // Logic systems
        // -------------------------------------
        systemLogic1 = new COMP.System.Logic({
            name: 'EpicSystemLogic1',
            dependencies: ['EpicSystemLogic3', 'EpicSystemLogic2'],
            requiredDependencies: ['EpicSystemLogic3', 'EpicSystemLogic2'],
            component: function () {
                return 'L1c';
            },
            process: function (entities) {
                systemExecutionPattern.push('L1');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemLogic1 + '-' + e.name);
                });
            }
        });

        systemLogic2 = new COMP.System.Logic({
            name: 'EpicSystemLogic2',
            component: function () {
                return 'L2c';
            },
            process: function (entities) {
                systemExecutionPattern.push('L2');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemLogic2 + '-' + e.name);
                });
            }
        });

        systemLogic3 = new COMP.System.Logic({
            name: 'EpicSystemLogic3',
            component: function () {
                return 'L3c';
            },
            process: function (entities) {
                systemExecutionPattern.push('L3');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemLogic3 + '-' + e.name);
                });
            }
        });

        systemLogic4 = new COMP.System.Logic({
            name: 'EpicSystemLogic4',
            component: function () {
                return 'L4c';
            },
            process: function (entities) {
                systemExecutionPattern.push('L4');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemLogic4 + '-' + e.name);
                });
            }
        });

        systemLogic5 = new COMP.System.Logic({
            name: 'EpicSystemLogic5',
            dependencies: ['EpicSystemLogic1', 'EpicSystemIO8'],
            requiredDependencies: ['EpicSystemLogic1', 'EpicSystemIO8'],
            component: function () {
                return 'L5c';
            },
            process: function (entities) {
                systemExecutionPattern.push('L5');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemLogic5 + '-' + e.name);
                });
            }
        });

        systemLogic6 = new COMP.System.Logic({
            name: 'EpicSystemLogic6',
            thread: true,
            // requiredDependencies: ['NonExistandSystem1', 'NonExistandSystem2'],
            component: function () {
                return 'L6c';
            },
            process: function (entities) {
                systemExecutionPattern.push('L6');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemLogic6 + '-' + e.name);
                });
                this.yield();
            }
        });

        systemLogic7 = new COMP.System.Logic({
            name: 'EpicSystemLogic7',
            dependencies: ['EpicSystemLogic8', 'EpicSystemLogic1', 'EpicSystemSL1'],
            requiredDependencies: ['EpicSystemLogic8', 'EpicSystemLogic1', 'EpicSystemSL1'],
            component: function () {
                return 'L7c';
            },
            process: function (entities) {
                systemExecutionPattern.push('L7');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemLogic7 + '-' + e.name);
                });
            }
        });

        systemLogic8 = new COMP.System.Logic({
            name: 'EpicSystemLogic8',
            component: function (defaults) {
                return defaults ? defaults.value : 'L8c';
            },
            process: function (entities) {
                systemExecutionPattern.push('L8');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemLogic8 + '-' + e.name);
                });
            }
        });

        systemLogic9 = new COMP.System.Logic({
            name: 'EpicSystemLogic9',
            dependencies: ['EpicSystemLogic1'],
            requiredDependencies: ['EpicSystemLogic3'],
            component: function () {
                return 'L9c';
            },
            process: function (entities) {
                systemExecutionPattern.push('L9');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemLogic9 + '-' + e.name);
                });
            }
        });

        systemStaticLogic1 = new COMP.System.Logic({
            name: 'EpicSystemSL1',
            isStatic: true,
            dependencies: ['EpicSystemSL2'],
            requiredDependencies: ['EpicSystemSL2'],
            component: function () {
                return 'SL1c';
            },
            process: function (staticEntity) {
                systemExecutionPattern.push('SL1');
                componentExecutionPattern.push(staticEntity.EpicSystemSL1 + '-' + staticEntity.name);
            }
        });

        systemStaticLogic2 = new COMP.System.Logic({
            name: 'EpicSystemSL2',
            isStatic: true,
            component: function () {
                return 'SL2c';
            },
            process: function (staticEntity) {
                systemExecutionPattern.push('SL2');
                componentExecutionPattern.push(staticEntity.EpicSystemSL2 + '-' + staticEntity.name);
            }
        });

        // Interpolation systems
        // -------------------------------------
        systemInterpolation1 = new COMP.System.Interpolate({
            name: 'EpicSystemInterpolate1',
            dependencies: ['EpicSystemInterpolate3', 'EpicSystemInterpolate2'],
            requiredDependencies: ['EpicSystemInterpolate3', 'EpicSystemInterpolate2'],
            component: function () {
                return 'I1c';
            },
            process: function (entities, interpolation) {
                expect(interpolation).toBeDefined();
                systemExecutionPattern.push('I1');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemInterpolate1 + '-' + e.name);
                });
            }
        });

        systemInterpolation2 = new COMP.System.Interpolate({
            name: 'EpicSystemInterpolate2',
            component: function () {
                return 'I2c';
            },
            process: function (entities, interpolation) {
                systemExecutionPattern.push('I2');
                expect(interpolation).toBeDefined();
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemInterpolate2 + '-' + e.name);
                });
            }
        });

        systemInterpolation3 = new COMP.System.Interpolate({
            name: 'EpicSystemInterpolate3',
            component: function () {
                return 'I3c';
            },
            process: function (entities, interpolation) {
                expect(interpolation).toBeDefined();
                systemExecutionPattern.push('I3');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemInterpolate3 + '-' + e.name);
                });
            }
        });

        systemInterpolation4 = new COMP.System.Interpolate({
            name: 'EpicSystemInterpolate4',
            component: function () {
                return 'I4c';
            },
            process: function (entities, interpolation) {
                expect(interpolation).toBeDefined();
                systemExecutionPattern.push('I4');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemInterpolate4 + '-' + e.name);
                });
            }
        });

        systemInterpolation5 = new COMP.System.Interpolate({
            name: 'EpicSystemInterpolate5',
            dependencies: ['EpicSystemInterpolate1'],
            requiredDependencies: ['EpicSystemInterpolate1'],
            component: function () {
                return 'I5c';
            },
            process: function (entities, interpolation) {
                expect(interpolation).toBeDefined();
                systemExecutionPattern.push('I5');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemInterpolate5 + '-' + e.name);
                });
            }
        });

        systemInterpolation6 = new COMP.System.Interpolate({
            name: 'EpicSystemInterpolate6',
            thread: true,
            // requiredDependencies: ['NonExistandSystem1', 'NonExistandSystem2'],
            component: function () {
                return 'I6c';
            },
            process: function (entities, interpolation) {
                expect(interpolation).toBeDefined();
                systemExecutionPattern.push('I6');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemInterpolate6 + '-' + e.name);
                });
                this.yield();
            }
        });

        systemInterpolation7 = new COMP.System.Interpolate({
            name: 'EpicSystemInterpolate7',
            dependencies: ['EpicSystemInterpolate8', 'EpicSystemInterpolate1'],
            requiredDependencies: ['EpicSystemInterpolate8', 'EpicSystemInterpolate1'],
            component: function (defaults) {
                return defaults ? defaults.value : 'I7c';
            },
            process: function (entities, interpolation) {
                expect(interpolation).toBeDefined();
                systemExecutionPattern.push('I7');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemInterpolate7 + '-' + e.name);
                });
            }
        });

        systemInterpolation8 = new COMP.System.Interpolate({
            name: 'EpicSystemInterpolate8',
            component: function () {
                return 'I8c';
            },
            process: function (entities, interpolation) {
                expect(interpolation).toBeDefined();
                systemExecutionPattern.push('I8');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemInterpolate8 + '-' + e.name);
                });
            }
        });

        systemInterpolation9 = new COMP.System.Interpolate({
            name: 'EpicSystemInterpolate9',
            dependencies: ['EpicSystemInterpolate1'],
            requiredDependencies: ['EpicSystemInterpolate3'],
            component: function () {
                return 'I9c';
            },
            process: function (entities, interpolation) {
                expect(interpolation).toBeDefined();
                systemExecutionPattern.push('I9');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemInterpolate9 + '-' + e.name);
                });
            }
        });

        systemStaticInterpolation1 = new COMP.System.Interpolate({
            name: 'EpicSystemSI1',
            isStatic: true,
            dependencies: ['EpicSystemSI2'],
            requiredDependencies: ['EpicSystemSI2'],
            component: function () {
                return 'SI1c';
            },
            process: function (staticEntity) {
                systemExecutionPattern.push('SI1');
                componentExecutionPattern.push(staticEntity.EpicSystemSI1 + '-' + staticEntity.name);
            }
        });

        systemStaticInterpolation2 = new COMP.System.Interpolate({
            name: 'EpicSystemSI2',
            isStatic: true,
            component: function () {
                return 'SI2c';
            },
            process: function (staticEntity) {
                systemExecutionPattern.push('SI2');
                componentExecutionPattern.push(staticEntity.EpicSystemSI2 + '-' + staticEntity.name);
            }
        });

        // IO systems
        // -------------------------------------
        systemIO1 = new COMP.System.IO({
            name: 'EpicSystemIO1',
            dependencies: ['EpicSystemIO3', 'EpicSystemIO2'],
            requiredDependencies: ['EpicSystemIO3', 'EpicSystemIO2'],
            component: function () {
                return 'IO1c';
            },
            process: function (entities) {
                systemExecutionPattern.push('IO1');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemIO1 + '-' + e.name);
                });
            }
        });

        systemIO2 = new COMP.System.IO({
            name: 'EpicSystemIO2',
            component: function () {
                return 'IO2c';
            },
            process: function (entities) {
                systemExecutionPattern.push('IO2');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemIO2 + '-' + e.name);
                });
            }
        });

        systemIO3 = new COMP.System.IO({
            name: 'EpicSystemIO3',
            component: function () {
                return 'IO3c';
            },
            process: function (entities) {
                systemExecutionPattern.push('IO3');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemIO3 + '-' + e.name);
                });
            }
        });

        systemIO4 = new COMP.System.IO({
            name: 'EpicSystemIO4',
            component: function () {
                return 'IO4c';
            },
            process: function (entities) {
                systemExecutionPattern.push('IO4');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemIO4 + '-' + e.name);
                });
            }
        });

        systemIO5 = new COMP.System.IO({
            name: 'EpicSystemIO5',
            dependencies: ['EpicSystemIO1'],
            requiredDependencies: ['EpicSystemIO1'],
            component: function () {
                return 'IO5c';
            },
            process: function (entities) {
                systemExecutionPattern.push('IO5');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemIO5 + '-' + e.name);
                });
            }
        });

        systemIO6 = new COMP.System.IO({
            name: 'EpicSystemIO6',
            thread: true,
            // requiredDependencies: ['NonExistandSystem1', 'NonExistandSystem2'],
            component: function () {
                return 'IO6c';
            },
            process: function (entities) {
                systemExecutionPattern.push('IO6');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemIO6 + '-' + e.name);
                });
                this.yield();
            }
        });

        systemIO7 = new COMP.System.IO({
            name: 'EpicSystemIO7',
            dependencies: ['EpicSystemIO8', 'EpicSystemIO1'],
            requiredDependencies: ['EpicSystemIO8', 'EpicSystemIO1'],
            component: function () {
                return 'IO7c';
            },
            process: function (entities) {
                systemExecutionPattern.push('IO7');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemIO7 + '-' + e.name);
                });
            }
        });

        systemIO8 = new COMP.System.IO({
            name: 'EpicSystemIO8',
            dependencies: [],
            requiredDependencies: [],
            component: function () {
                return 'IO8c';
            },
            process: function (entities) {
                systemExecutionPattern.push('IO8');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemIO8 + '-' + e.name);
                });
            }
        });

        systemIO9 = new COMP.System.IO({
            name: 'EpicSystemIO9',
            dependencies: ['EpicSystemIO1'],
            requiredDependencies: ['EpicSystemIO3'],
            component: function () {
                return 'IO9c';
            },
            process: function (entities) {
                systemExecutionPattern.push('IO9');
                _.each(entities, function (e) {
                    componentExecutionPattern.push(e.EpicSystemIO9 + '-' + e.name);
                });
            }
        });

        systemStaticIO1 = new COMP.System.IO({
            name: 'EpicSystemSIO1',
            isStatic: true,
            dependencies: ['EpicSystemSIO2'],
            requiredDependencies: ['EpicSystemSIO2'],
            component: function () {
                return 'SIO1c';
            },
            process: function (staticEntity) {
                systemExecutionPattern.push('SIO1');
                componentExecutionPattern.push(staticEntity.EpicSystemSIO1 + '-' + staticEntity.name);
            }
        });

        systemStaticIO2 = new COMP.System.IO({
            name: 'EpicSystemSIO2',
            isStatic: true,
            component: function () {
                return 'SIO2c';
            },
            process: function (staticEntity) {
                systemExecutionPattern.push('SIO2');
                componentExecutionPattern.push(staticEntity.EpicSystemSIO2 + '-' + staticEntity.name);
            }
        });
    });

    // add entities
    beforeEach(function () {
        entity1 = new COMP.Entity({
            name: 'entity1',
            components: ['EpicSystemLogic1']
        });

        entity2 = new COMP.Entity({
            name: 'entity2',
            components: [
                'EpicSystemLogic8',
                'EpicSystemSIO1'
            ]
        });

        entity3 = new COMP.Entity({
            name: 'entity3',
            components: ['EpicSystemLogic2', 'EpicSystemSL1']
        });

        entity4 = new COMP.Entity({
            name: 'entity4',
            components: [
                'EpicSystemLogic6',
                'EpicSystemLogic5',
                'EpicSystemLogic3',
                'EpicSystemLogic4'
            ]
        });

        entity5 = new COMP.Entity({
            name: 'entity5',
            components: [
                'EpicSystemLogic6',
                'EpicSystemLogic5',
                'EpicSystemIO5',
                'EpicSystemIO7',
                'EpicSystemInterpolate6'
            ]
        });

        entity6 = new COMP.Entity({
            name: 'entity6',
            components: {
                'EpicSystemIO1': undefined,
                'EpicSystemLogic2': undefined,
                'EpicSystemLogic7': undefined,
                'EpicSystemLogic8': { value: 'L8c-custome' },
                'EpicSystemInterpolate2': undefined
            }
        });

        entity7 = new COMP.Entity({
            name: 'entity7',
            components: [
                'EpicSystemIO9',
                'EpicSystemInterpolate9',
                'EpicSystemLogic9',
            ]
        });
    });

    it('should throw exception for existance system name', function () {
        expect(COMP.System.Logic.bind({}, {
            name: 'EpicSystemLogic1',
            component: function () {},
            process: function () {}
        })).toThrow(new Error('system under name "EpicSystemLogic1" already exists'));

        expect(COMP.System.IO.bind({}, {
            name: 'EpicSystemIO1',
            component: function () {},
            process: function () {}
        })).toThrow(new Error('system under name "EpicSystemIO1" already exists'));
    });

    it('should throw exception for dependency containg same system name', function () {
        expect(COMP.System.Logic.bind({}, {
            name: 'SameEpicSystemLogic',
            dependencies: ['SameEpicSystemLogic'],
            component: function () {},
            process: function () {}
        })).toThrow(new Error('system cannot depend on it self'));

        expect(COMP.System.Interpolate.bind({}, {
            name: 'SameEpicSystemIO',
            dependencies: ['SameEpicSystemIO'],
            component: function () {},
            process: function () {}
        })).toThrow(new Error('system cannot depend on it self'));

        expect(COMP.System.IO.bind({}, {
            name: 'SameEpicSystemIO',
            dependencies: ['SameEpicSystemIO'],
            component: function () {},
            process: function () {}
        })).toThrow(new Error('system cannot depend on it self'));
    });

    it('should throw exception for component not found', function () {
        expect(COMP.Entity.bind({}, {
            name: 'CrapEntity',
            components: ['NonExistingEpicSystem']
        })).toThrow(new Error('System "NonExistingEpicSystem" not found'));
    });

    it('should process Logic, Interpolation and IO systems in correct order', function () {
        COMP.cycleOnce(function () {
            // should execute logic and IO systems in order
            expect(systemExecutionPattern).toEqual([
                'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                'SI2', 'SI1', 'I8', 'I6', 'I4', 'I2', 'I3', 'I1', 'I5', 'I7', 'I9',
                'SIO2', 'SIO1', 'IO8', 'IO6', 'IO4', 'IO2', 'IO3', 'IO1', 'IO5', 'IO7', 'IO9'
            ]);

            systemExecutionPattern = [];
            componentExecutionPattern = [];
        });

        COMP.spiralCycle(function () {
            // should execute logic systems maximum times to avoid spiral of death
            expect(systemExecutionPattern).toEqual([
                'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                'SI2', 'SI1', 'I8', 'I6', 'I4', 'I2', 'I3', 'I1', 'I5', 'I7', 'I9',
                'SIO2', 'SIO1', 'IO8', 'IO6', 'IO4', 'IO2', 'IO3', 'IO1', 'IO5', 'IO7', 'IO9'
            ]);

            systemExecutionPattern = [];
            componentExecutionPattern = [];
        });
    });

    it('should process entities in the correct order', function () {
        COMP.cycleOnce(function () {
            // should execute components in order
            expect(componentExecutionPattern).toEqual([
                'SL2c-staticEntity', 'SL1c-staticEntity',
                'L8c-entity2', 'L8c-custome-entity6',
                'L6c-entity4', 'L6c-entity5',
                'L4c-entity4',
                'L2c-entity1', 'L2c-entity3', 'L2c-entity4', 'L2c-entity5', 'L2c-entity6',
                'L3c-entity1', 'L3c-entity4', 'L3c-entity5', 'L3c-entity6', 'L3c-entity7',
                'L1c-entity1', 'L1c-entity4', 'L1c-entity5', 'L1c-entity6',
                'L5c-entity4', 'L5c-entity5',
                'L7c-entity6',
                'L9c-entity7',
                'SI2c-staticEntity', 'SI1c-staticEntity',
                'I6c-entity5',
                'I2c-entity6',
                'I3c-entity7',
                'I9c-entity7',
                'SIO2c-staticEntity', 'SIO1c-staticEntity',
                'IO8c-entity4', 'IO8c-entity5',
                'IO2c-entity5', 'IO2c-entity6',
                'IO3c-entity5', 'IO3c-entity6', 'IO3c-entity7',
                'IO1c-entity5', 'IO1c-entity6',
                'IO5c-entity5',
                'IO7c-entity5',
                'IO9c-entity7'
            ]);

            systemExecutionPattern = [];
            componentExecutionPattern = [];
        });

        COMP.spiralCycle(function () {
            expect(componentExecutionPattern).toEqual([
                'SL2c-staticEntity', 'SL1c-staticEntity', 'L8c-entity2', 'L8c-custome-entity6', 'L6c-entity4', 'L6c-entity5', 'L4c-entity4', 'L2c-entity1', 'L2c-entity3', 'L2c-entity4', 'L2c-entity5', 'L2c-entity6', 'L3c-entity1', 'L3c-entity4', 'L3c-entity5', 'L3c-entity6', 'L3c-entity7', 'L1c-entity1', 'L1c-entity4', 'L1c-entity5', 'L1c-entity6', 'L5c-entity4', 'L5c-entity5', 'L7c-entity6', 'L9c-entity7',
                'SL2c-staticEntity', 'SL1c-staticEntity', 'L8c-entity2', 'L8c-custome-entity6', 'L6c-entity4', 'L6c-entity5', 'L4c-entity4', 'L2c-entity1', 'L2c-entity3', 'L2c-entity4', 'L2c-entity5', 'L2c-entity6', 'L3c-entity1', 'L3c-entity4', 'L3c-entity5', 'L3c-entity6', 'L3c-entity7', 'L1c-entity1', 'L1c-entity4', 'L1c-entity5', 'L1c-entity6', 'L5c-entity4', 'L5c-entity5', 'L7c-entity6', 'L9c-entity7',
                'SL2c-staticEntity', 'SL1c-staticEntity', 'L8c-entity2', 'L8c-custome-entity6', 'L6c-entity4', 'L6c-entity5', 'L4c-entity4', 'L2c-entity1', 'L2c-entity3', 'L2c-entity4', 'L2c-entity5', 'L2c-entity6', 'L3c-entity1', 'L3c-entity4', 'L3c-entity5', 'L3c-entity6', 'L3c-entity7', 'L1c-entity1', 'L1c-entity4', 'L1c-entity5', 'L1c-entity6', 'L5c-entity4', 'L5c-entity5', 'L7c-entity6', 'L9c-entity7',
                'SL2c-staticEntity', 'SL1c-staticEntity', 'L8c-entity2', 'L8c-custome-entity6', 'L6c-entity4', 'L6c-entity5', 'L4c-entity4', 'L2c-entity1', 'L2c-entity3', 'L2c-entity4', 'L2c-entity5', 'L2c-entity6', 'L3c-entity1', 'L3c-entity4', 'L3c-entity5', 'L3c-entity6', 'L3c-entity7', 'L1c-entity1', 'L1c-entity4', 'L1c-entity5', 'L1c-entity6', 'L5c-entity4', 'L5c-entity5', 'L7c-entity6', 'L9c-entity7',
                'SL2c-staticEntity', 'SL1c-staticEntity', 'L8c-entity2', 'L8c-custome-entity6', 'L6c-entity4', 'L6c-entity5', 'L4c-entity4', 'L2c-entity1', 'L2c-entity3', 'L2c-entity4', 'L2c-entity5', 'L2c-entity6', 'L3c-entity1', 'L3c-entity4', 'L3c-entity5', 'L3c-entity6', 'L3c-entity7', 'L1c-entity1', 'L1c-entity4', 'L1c-entity5', 'L1c-entity6', 'L5c-entity4', 'L5c-entity5', 'L7c-entity6', 'L9c-entity7',
                'SI2c-staticEntity', 'SI1c-staticEntity', 'I6c-entity5', 'I2c-entity6', 'I3c-entity7', 'I9c-entity7',
                'SIO2c-staticEntity', 'SIO1c-staticEntity', 'IO8c-entity4', 'IO8c-entity5', 'IO2c-entity5', 'IO2c-entity6', 'IO3c-entity5', 'IO3c-entity6', 'IO3c-entity7', 'IO1c-entity5', 'IO1c-entity6', 'IO5c-entity5', 'IO7c-entity5', 'IO9c-entity7'
            ]);

            systemExecutionPattern = [];
            componentExecutionPattern = [];
        });
    });

    describe('remove entities', function () {
        beforeEach(function () {
            entity1.remove();
            entity2.remove();
            entity3.remove();
            entity4.remove();
            entity5.remove();
        });

        it('should remove entities and process systems in correct order', function () {
            COMP.cycleOnce(function () {
                // should execute components in order
                expect(componentExecutionPattern).toEqual([
                    'SL2c-staticEntity', 'SL1c-staticEntity',
                    'L8c-custome-entity6', 'L2c-entity6', 'L3c-entity6', 'L3c-entity7', 'L1c-entity6', 'L7c-entity6', 'L9c-entity7',
                    'SI2c-staticEntity', 'SI1c-staticEntity', 'I2c-entity6',
                    'I3c-entity7', 'I9c-entity7',
                    'SIO2c-staticEntity', 'SIO1c-staticEntity',
                    'IO2c-entity6', 'IO3c-entity6', 'IO3c-entity7', 'IO1c-entity6', 'IO9c-entity7'
                ]);

                systemExecutionPattern = [];
                componentExecutionPattern = [];
            });

            COMP.spiralCycle(function () {
                expect(componentExecutionPattern).toEqual([
                    'SL2c-staticEntity', 'SL1c-staticEntity', 'L8c-custome-entity6', 'L2c-entity6', 'L3c-entity6', 'L3c-entity7', 'L1c-entity6', 'L7c-entity6', 'L9c-entity7',
                    'SL2c-staticEntity', 'SL1c-staticEntity', 'L8c-custome-entity6', 'L2c-entity6', 'L3c-entity6', 'L3c-entity7', 'L1c-entity6', 'L7c-entity6', 'L9c-entity7',
                    'SL2c-staticEntity', 'SL1c-staticEntity', 'L8c-custome-entity6', 'L2c-entity6', 'L3c-entity6', 'L3c-entity7', 'L1c-entity6', 'L7c-entity6', 'L9c-entity7',
                    'SL2c-staticEntity', 'SL1c-staticEntity', 'L8c-custome-entity6', 'L2c-entity6', 'L3c-entity6', 'L3c-entity7', 'L1c-entity6', 'L7c-entity6', 'L9c-entity7',
                    'SL2c-staticEntity', 'SL1c-staticEntity', 'L8c-custome-entity6', 'L2c-entity6', 'L3c-entity6', 'L3c-entity7', 'L1c-entity6', 'L7c-entity6', 'L9c-entity7',
                    'SI2c-staticEntity', 'SI1c-staticEntity', 'I2c-entity6', 'I3c-entity7', 'I9c-entity7',
                    'SIO2c-staticEntity', 'SIO1c-staticEntity',
                    'IO2c-entity6', 'IO3c-entity6', 'IO3c-entity7', 'IO1c-entity6', 'IO9c-entity7'
                ]);

                systemExecutionPattern = [];
                componentExecutionPattern = [];
            });
        });

        describe('update entity', function () {
            beforeEach(function () {
                entity6.components = {
                    'EpicSystemIO1': undefined,
                    'EpicSystemLogic7': undefined,
                    'EpicSystemLogic8': { value: 'L8c-custome2' },
                    'EpicSystemInterpolate2': undefined,
                    'EpicSystemLogic3': undefined,
                    'EpicSystemInterpolate7': { value: 'I7c-custome' }
                };

                entity6 = entity6.update();
            });

            it('should update entity6 and process systems in correct order', function () {
                COMP.cycleOnce(function () {
                    // should execute components in order
                    expect(componentExecutionPattern).toEqual([
                        'SL2c-staticEntity', 'SL1c-staticEntity', 'L8c-custome-entity6', 'L2c-entity6', 'L3c-entity6', 'L3c-entity7', 'L1c-entity6', 'L7c-entity6', 'L9c-entity7',
                        'SI2c-staticEntity', 'SI1c-staticEntity', 'I8c-entity6', 'I2c-entity6', 'I3c-entity7', 'I3c-entity6', 'I1c-entity6', 'I7c-custome-entity6', 'I9c-entity7',
                        'SIO2c-staticEntity', 'SIO1c-staticEntity', 'IO2c-entity6', 'IO3c-entity6', 'IO3c-entity7', 'IO1c-entity6', 'IO9c-entity7'
                    ]);

                    systemExecutionPattern = [];
                    componentExecutionPattern = [];
                });

                COMP.spiralCycle(function () {
                    expect(componentExecutionPattern).toEqual([
                        'SL2c-staticEntity', 'SL1c-staticEntity', 'L8c-custome-entity6', 'L2c-entity6', 'L3c-entity6', 'L3c-entity7', 'L1c-entity6', 'L7c-entity6', 'L9c-entity7',
                        'SL2c-staticEntity', 'SL1c-staticEntity', 'L8c-custome-entity6', 'L2c-entity6', 'L3c-entity6', 'L3c-entity7', 'L1c-entity6', 'L7c-entity6', 'L9c-entity7',
                        'SL2c-staticEntity', 'SL1c-staticEntity', 'L8c-custome-entity6', 'L2c-entity6', 'L3c-entity6', 'L3c-entity7', 'L1c-entity6', 'L7c-entity6', 'L9c-entity7',
                        'SL2c-staticEntity', 'SL1c-staticEntity', 'L8c-custome-entity6', 'L2c-entity6', 'L3c-entity6', 'L3c-entity7', 'L1c-entity6', 'L7c-entity6', 'L9c-entity7',
                        'SL2c-staticEntity', 'SL1c-staticEntity', 'L8c-custome-entity6', 'L2c-entity6', 'L3c-entity6', 'L3c-entity7', 'L1c-entity6', 'L7c-entity6', 'L9c-entity7',
                        'SI2c-staticEntity', 'SI1c-staticEntity', 'I8c-entity6', 'I2c-entity6', 'I3c-entity7', 'I3c-entity6', 'I1c-entity6', 'I7c-custome-entity6', 'I9c-entity7',
                        'SIO2c-staticEntity', 'SIO1c-staticEntity',
                        'IO2c-entity6', 'IO3c-entity6', 'IO3c-entity7', 'IO1c-entity6', 'IO9c-entity7'

                    ]);

                    systemExecutionPattern = [];
                    componentExecutionPattern = [];
                });
            });

            it('should run cycles 5 times', function () {
                COMP.cycleMany(5, function () {
                    expect(systemExecutionPattern).toEqual([
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SI2', 'SI1', 'I8', 'I6', 'I4', 'I2', 'I3', 'I1', 'I5', 'I7', 'I9',
                        'SIO2', 'SIO1', 'IO8', 'IO6', 'IO4', 'IO2', 'IO3', 'IO1', 'IO5', 'IO7', 'IO9',

                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SI2', 'SI1', 'I8', 'I6', 'I4', 'I2', 'I3', 'I1', 'I5', 'I7', 'I9',
                        'SIO2', 'SIO1', 'IO8', 'IO6', 'IO4', 'IO2', 'IO3', 'IO1', 'IO5', 'IO7', 'IO9',

                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SI2', 'SI1', 'I8', 'I6', 'I4', 'I2', 'I3', 'I1', 'I5', 'I7', 'I9',
                        'SIO2', 'SIO1', 'IO8', 'IO6', 'IO4', 'IO2', 'IO3', 'IO1', 'IO5', 'IO7', 'IO9',

                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SI2', 'SI1', 'I8', 'I6', 'I4', 'I2', 'I3', 'I1', 'I5', 'I7', 'I9',
                        'SIO2', 'SIO1', 'IO8', 'IO6', 'IO4', 'IO2', 'IO3', 'IO1', 'IO5', 'IO7', 'IO9',

                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SI2', 'SI1', 'I8', 'I6', 'I4', 'I2', 'I3', 'I1', 'I5', 'I7', 'I9',
                        'SIO2', 'SIO1', 'IO8', 'IO6', 'IO4', 'IO2', 'IO3', 'IO1', 'IO5', 'IO7', 'IO9'
                    ]);

                    systemExecutionPattern = [];
                    componentExecutionPattern = [];
                });
            });

            it('should run spiral cycles 5 times', function () {
                COMP.spiralCycleMany(5, function () {
                    expect(systemExecutionPattern).toEqual([
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SI2', 'SI1', 'I8', 'I6', 'I4', 'I2', 'I3', 'I1', 'I5', 'I7', 'I9',
                        'SIO2', 'SIO1', 'IO8', 'IO6', 'IO4', 'IO2', 'IO3', 'IO1', 'IO5', 'IO7', 'IO9',

                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SI2', 'SI1', 'I8', 'I6', 'I4', 'I2', 'I3', 'I1', 'I5', 'I7', 'I9',
                        'SIO2', 'SIO1', 'IO8', 'IO6', 'IO4', 'IO2', 'IO3', 'IO1', 'IO5', 'IO7', 'IO9',

                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SI2', 'SI1', 'I8', 'I6', 'I4', 'I2', 'I3', 'I1', 'I5', 'I7', 'I9',
                        'SIO2', 'SIO1', 'IO8', 'IO6', 'IO4', 'IO2', 'IO3', 'IO1', 'IO5', 'IO7', 'IO9',

                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SI2', 'SI1', 'I8', 'I6', 'I4', 'I2', 'I3', 'I1', 'I5', 'I7', 'I9',
                        'SIO2', 'SIO1', 'IO8', 'IO6', 'IO4', 'IO2', 'IO3', 'IO1', 'IO5', 'IO7', 'IO9',

                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L5', 'L7', 'L9',
                        'SI2', 'SI1', 'I8', 'I6', 'I4', 'I2', 'I3', 'I1', 'I5', 'I7', 'I9',
                        'SIO2', 'SIO1', 'IO8', 'IO6', 'IO4', 'IO2', 'IO3', 'IO1', 'IO5', 'IO7', 'IO9',
                    ]);

                    systemExecutionPattern = [];
                    componentExecutionPattern = [];
                });
            });

            it('should throw exception when removing system with entities', function () {
                expect(systemLogic8.remove.bind(systemLogic8, {}))
                    .toThrow(new Error('entities still using this system, please remove dependent entities before removing the system'));
            });

            describe('remove system', function () {
                beforeEach(function () {
                    systemLogic5.remove();
                });

                it('should remove system', function () {
                    COMP.cycleOnce(function () {
                        expect(systemExecutionPattern).toEqual([
                            'SL2', 'SL1', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L7', 'L9',
                            'SI2', 'SI1', 'I8', 'I6', 'I4', 'I2', 'I3', 'I1', 'I5', 'I7', 'I9',
                            'SIO2', 'SIO1', 'IO8', 'IO6', 'IO4', 'IO2', 'IO3', 'IO1', 'IO5', 'IO7', 'IO9'
                        ]);

                        systemExecutionPattern = [];
                        componentExecutionPattern = [];
                    });
                });

                it('should throw exception when removing static system with entities', function () {
                    expect(systemStaticLogic1.remove.bind(systemStaticLogic1, {}))
                        .toThrow(new Error('entities still using this system, please remove dependent entities before removing the system'));
                });

                it('should remove static system', function () {
                    entity6.remove();
                    systemLogic7.remove();
                    systemStaticLogic1.remove();

                    COMP.cycleOnce(function () {
                        expect(systemExecutionPattern).toEqual([
                            'SL2', 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L9',
                            'SI2', 'SI1', 'I8', 'I6', 'I4', 'I2', 'I3', 'I1', 'I5', 'I7', 'I9',
                            'SIO2', 'SIO1', 'IO8', 'IO6', 'IO4', 'IO2', 'IO3', 'IO1', 'IO5', 'IO7', 'IO9'
                        ]);

                        systemExecutionPattern = [];
                        componentExecutionPattern = [];
                    });
                });

                it('should allow to have missing dependency system', function () {
                    var missingDepSystem = new COMP.System.Logic({
                        name: 'MissingDepEpicSystem',
                        dependencies: ['EpicSystemIO1', 'MissingSystem'],
                        requiredDependencies: ['EpicSystemIO1'],
                        component: function () {},
                        process: function () {}
                    });

                    COMP();

                    missingDepSystem.remove();
                });

                it('should throw exception if system has missing required dependency system', function () {
                    var missingDepSystem = new COMP.System.Logic({
                        name: 'MissingDepEpicSystem',
                        dependencies: ['EpicSystemIO1'],
                        requiredDependencies: ['EpicSystemIO1', 'MissingSystem'],
                        component: function () {},
                        process: function () {}
                    });

                    expect(COMP).toThrow(new Error('Dependency system "MissingSystem" not found'));
                    missingDepSystem.remove();
                });

                it('should throw exception if static system has non-static system as dependency', function () {
                    var badStaticLogic = new COMP.System.Logic({
                        name: 'BadEpicSystemSL',
                        isStatic: true,
                        dependencies: ['EpicSystemIO1'],
                        requiredDependencies: ['EpicSystemIO1'],
                        component: function () {},
                        process: function () {}
                    });

                    expect(COMP).toThrow(new Error('Static system can\'t have non-static system as required dependency'));
                    badStaticLogic.remove();
                });
            });

        });
    });

});
