describe("core", function() {
  describe("register systems", function() {
    var systemLogic1, systemLogic2, systemLogic3, systemLogic4, systemLogic5, systemLogic6, systemLogic7, systemLogic8,
        systemIO1, systemIO2, systemIO3, systemIO4, systemIO5, systemIO6, systemIO7, systemIO8,
        systemInterpolation1, systemInterpolation2, systemInterpolation3, systemInterpolation4, systemInterpolation5, systemInterpolation6, systemInterpolation7, systemInterpolation8,
        entity1,
        systemExecutionPattern = [];
        componentExecutionPattern = [];

    beforeEach(function() {
    });

    it("should add system", function () {
      // Logic systems
      // -------------------------------------
      systemLogic1 = new COMP.System.Logic({
        name: 'EpicSystemLogic1',
        dependencies: ['EpicSystemLogic3', 'EpicSystemLogic2'], 
        component: function() { return 'L1c'; }, 
        proccess: function(entities) {
          systemExecutionPattern.push('L1');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemLogic1'] + '-' + e.name); });
        }
      });

      systemLogic2 = new COMP.System.Logic({
        name: 'EpicSystemLogic2',
        dependencies: [], 
        component: function() { return 'L2c'; }, 
        proccess: function(entities) {
          systemExecutionPattern.push('L2');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemLogic2'] + '-' + e.name); });
        }
      });

      systemLogic3 = new COMP.System.Logic({
        name: 'EpicSystemLogic3',
        dependencies: [], 
        component: function() { return 'L3c'; }, 
        proccess: function(entities) {
          systemExecutionPattern.push('L3');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemLogic3'] + '-' + e.name); });
        }
      });

      systemLogic4 = new COMP.System.Logic({
        name: 'EpicSystemLogic4',
        dependencies: [], 
        component: function() { return 'L4c'; }, 
        proccess: function(entities) {
          systemExecutionPattern.push('L4');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemLogic4'] + '-' + e.name); });
        }
      });

      systemLogic5 = new COMP.System.Logic({
        name: 'EpicSystemLogic5',
        dependencies: ['EpicSystemLogic1'], 
        component: function() { return 'L5c'; }, 
        proccess: function(entities) {
          systemExecutionPattern.push('L5');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemLogic5'] + '-' + e.name); });
        }
      });

      systemLogic6 = new COMP.System.Logic({
        name: 'EpicSystemLogic6',
        dependencies: ['NonExistandSystem1', 'NonExistandSystem2'], 
        component: function() { return 'L6c'; }, 
        proccess: function(entities) { 
          systemExecutionPattern.push('L6');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemLogic6'] + '-' + e.name); });
        }
      });

      systemLogic7 = new COMP.System.Logic({
        name: 'EpicSystemLogic7',
        dependencies: ['EpicSystemLogic8', 'EpicSystemLogic1'], 
        component: function() { return 'L7c'; }, 
        proccess: function(entities) { 
          systemExecutionPattern.push('L7');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemLogic7'] + '-' + e.name); });
        }
      });

      systemLogic8 = new COMP.System.Logic({
        name: 'EpicSystemLogic8',
        dependencies: [], 
        component: function() { return 'L8c'; }, 
        proccess: function(entities) { 
          systemExecutionPattern.push('L8');
          _.each(entities, function(e) {
            componentExecutionPattern.push(e['EpicSystemLogic8'] + '-' + e.name);
          });
        }
      });

      // Interpolation systems
      // -------------------------------------
      systemInterpolation1 = new COMP.System.Interpolate({
        name: 'EpicSystemInterpolate1',
        dependencies: ['EpicSystemInterpolate3', 'EpicSystemInterpolate2'], 
        component: function() { return 'I1c'; }, 
        proccess: function(entities, interpolation) {
          expect(interpolation).toBeDefined();
          systemExecutionPattern.push('I1');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemInterpolate1'] + '-' + e.name); });
        }
      });

      systemInterpolation2 = new COMP.System.Interpolate({
        name: 'EpicSystemInterpolate2',
        dependencies: [], 
        component: function() { return 'I2c'; }, 
        proccess: function(entities, interpolation) {
          systemExecutionPattern.push('I2');
          expect(interpolation).toBeDefined();
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemInterpolate2'] + '-' + e.name); });
        }
      });

      systemInterpolation3 = new COMP.System.Interpolate({
        name: 'EpicSystemInterpolate3',
        dependencies: [], 
        component: function() { return 'I3c'; }, 
        proccess: function(entities, interpolation) {
          expect(interpolation).toBeDefined();
          systemExecutionPattern.push('I3');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemInterpolate3'] + '-' + e.name); });
        }
      });

      systemInterpolation4 = new COMP.System.Interpolate({
        name: 'EpicSystemInterpolate4',
        dependencies: [], 
        component: function() { return 'I4c'; }, 
        proccess: function(entities, interpolation) {
          expect(interpolation).toBeDefined();
          systemExecutionPattern.push('I4');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemInterpolate4'] + '-' + e.name); });
        }
      });

      systemInterpolation5 = new COMP.System.Interpolate({
        name: 'EpicSystemInterpolate5',
        dependencies: ['EpicSystemInterpolate1'], 
        component: function() { return 'I5c'; }, 
        proccess: function(entities, interpolation) {
          expect(interpolation).toBeDefined();
          systemExecutionPattern.push('I5');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemInterpolate5'] + '-' + e.name); });
        }
      });

      systemInterpolation6 = new COMP.System.Interpolate({
        name: 'EpicSystemInterpolate6',
        dependencies: ['NonExistandSystem1', 'NonExistandSystem2'], 
        component: function() { return 'I6c'; }, 
        proccess: function(entities, interpolation) { 
          expect(interpolation).toBeDefined();
          systemExecutionPattern.push('I6');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemInterpolate6'] + '-' + e.name); });
        }
      });

      systemInterpolation7 = new COMP.System.Interpolate({
        name: 'EpicSystemInterpolate7',
        dependencies: ['EpicSystemInterpolate8', 'EpicSystemInterpolate1'], 
        component: function() { return 'I7c'; }, 
        proccess: function(entities, interpolation) { 
          expect(interpolation).toBeDefined();
          systemExecutionPattern.push('I7');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemInterpolate7'] + '-' + e.name); });
        }
      });

      systemInterpolation8 = new COMP.System.Interpolate({
        name: 'EpicSystemInterpolate8',
        dependencies: [], 
        component: function() { return 'I8c'; }, 
        proccess: function(entities, interpolation) { 
          expect(interpolation).toBeDefined();
          systemExecutionPattern.push('I8');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemInterpolate8'] + '-' + e.name); });
        }
      });

      // IO systems
      // -------------------------------------
      systemIO1 = new COMP.System.IO({
        name: 'EpicSystemIO1',
        dependencies: ['EpicSystemIO3', 'EpicSystemIO2'], 
        component: function() { return 'IO1c'; }, 
        proccess: function(entities) {
          systemExecutionPattern.push('IO1');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemIO1'] + '-' + e.name); });
        }
      });

      systemIO2 = new COMP.System.IO({
        name: 'EpicSystemIO2',
        dependencies: [], 
        component: function() { return 'IO2c'; }, 
        proccess: function(entities) {
          systemExecutionPattern.push('IO2');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemIO2'] + '-' + e.name); });
        }
      });

      systemIO3 = new COMP.System.IO({
        name: 'EpicSystemIO3',
        dependencies: [], 
        component: function() { return 'IO3c'; }, 
        proccess: function(entities) {
          systemExecutionPattern.push('IO3');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemIO3'] + '-' + e.name); });
        }
      });

      systemIO4 = new COMP.System.IO({
        name: 'EpicSystemIO4',
        dependencies: [], 
        component: function() { return 'IO4c'; }, 
        proccess: function(entities) {
          systemExecutionPattern.push('IO4');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemIO4'] + '-' + e.name); });
        }
      });

      systemIO5 = new COMP.System.IO({
        name: 'EpicSystemIO5',
        dependencies: ['EpicSystemIO1'], 
        component: function() { return 'IO5c'; }, 
        proccess: function(entities) {
          systemExecutionPattern.push('IO5');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemIO5'] + '-' + e.name); });
        }
      });

      systemIO6 = new COMP.System.IO({
        name: 'EpicSystemIO6',
        dependencies: ['NonExistandSystem1', 'NonExistandSystem2'], 
        component: function() { return 'IO6c'; }, 
        proccess: function(entities) { 
          systemExecutionPattern.push('IO6');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemIO6'] + '-' + e.name); });
        }
      });

      systemIO7 = new COMP.System.IO({
        name: 'EpicSystemIO7',
        dependencies: ['EpicSystemIO8', 'EpicSystemIO1'], 
        component: function() { return 'IO7c'; }, 
        proccess: function(entities) { 
          systemExecutionPattern.push('IO7');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemIO7'] + '-' + e.name); });
        }
      });

      systemIO8 = new COMP.System.IO({
        name: 'EpicSystemIO8',
        dependencies: [], 
        component: function() { return 'IO8c'; }, 
        proccess: function(entities) { 
          systemExecutionPattern.push('IO8');
          _.each(entities, function(e) { componentExecutionPattern.push(e['EpicSystemIO8'] + '-' + e.name); });
        }
      });

    });

    it("should add entity", function () {
      new COMP.Entity({
        name: "entity1",
        components: ['EpicSystemLogic1']
      });

      new COMP.Entity({
        name: "entity2",
        components: ['EpicSystemLogic8']
      });

      new COMP.Entity({
        name: "entity3",
        components: ['EpicSystemLogic2']
      });

      new COMP.Entity({
        name: "entity4",
        components: ['EpicSystemLogic6', 'EpicSystemLogic5', 'EpicSystemLogic3', 'EpicSystemLogic4']
      });

      new COMP.Entity({
        name: "entity5",
        components: ['EpicSystemLogic6', 'EpicSystemLogic5', 'EpicSystemIO5', 'EpicSystemIO7', 'EpicSystemInterpolate6']
      });

      new COMP.Entity({
        name: "entity6",
        components: ['EpicSystemIO1', 'EpicSystemLogic2', 'EpicSystemLogic7', 'EpicSystemInterpolate2']
      });

    });

    it("should throw exception for existance system name", function () {
      expect(COMP.System.Logic.bind( null, {
        name: 'EpicSystemLogic1',
        dependencies: [], 
        component: function() { }, 
        proccess: function(entities) { }
      } )).toThrow('system under name "EpicSystemLogic1" already exists');
      
      expect(COMP.System.IO.bind( null, {
        name: 'EpicSystemIO1',
        dependencies: [], 
        component: function() { }, 
        proccess: function(entities) { }
      } )).toThrow('system under name "EpicSystemIO1" already exists');
    });

    it("should throw exception for dependency containg system name", function () {
      expect(COMP.System.Logic.bind( null, {
        name: 'SameEpicSystemLogic',
        dependencies: ['SameEpicSystemLogic'], 
        component: function() { }, 
        proccess: function(entities) { }
      } )).toThrow('system cannot depend on it self');

      expect(COMP.System.IO.bind( null, {
        name: 'SameEpicSystemIO',
        dependencies: ['SameEpicSystemIO'], 
        component: function() { }, 
        proccess: function(entities) { }
      } )).toThrow('system cannot depend on it self');
    });

    it("should proccess Logic and IO systems in correct order", function () {
      window.requestAnimationFrame = _.once(function(callback) {
        // make logicSystems will be called max times
        window.performance.now = function() {
          return 30; // miliseconds
        }
        callback.call();

        // should execute logic and IO systems in order
        expect(systemExecutionPattern).toEqual([ 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L7', 'L5', 
                                                 'I8', 'I6', 'I4', 'I2', 'I3', 'I1', 'I7', 'I5',
                                                 'IO8', 'IO6', 'IO4', 'IO2', 'IO3', 'IO1', 'IO7', 'IO5' ]);

        // should execute components in order
        expect(componentExecutionPattern).toEqual([ 'L8c-entity2', 'L8c-entity6',
                                                    'L6c-entity4', 'L6c-entity5',
                                                    'L4c-entity4',
                                                    'L2c-entity1', 'L2c-entity3', 'L2c-entity4', 'L2c-entity5', 'L2c-entity6',
                                                    'L3c-entity1', 'L3c-entity4', 'L3c-entity5', 'L3c-entity6',
                                                    'L1c-entity1', 'L1c-entity4', 'L1c-entity5', 'L1c-entity6',
                                                    'L7c-entity6',
                                                    'L5c-entity4', 'L5c-entity5',
                                                    'I6c-entity5', 'I2c-entity6',
                                                    'IO8c-entity5',
                                                    'IO2c-entity5', 'IO2c-entity6',
                                                    'IO3c-entity5', 'IO3c-entity6',
                                                    'IO1c-entity5', 'IO1c-entity6',
                                                    'IO7c-entity5',
                                                    'IO5c-entity5' ]);

        systemExecutionPattern = [];
        componentExecutionPattern = [];
        window.performance.now = function() {
          return Number.MAX_VALUE; // miliseconds
        }
        callback.call();

        // should execute logic systems maximum times to avoid spiral of death
        expect(systemExecutionPattern).toEqual([ 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L7', 'L5',
                                                 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L7', 'L5',
                                                 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L7', 'L5',
                                                 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L7', 'L5',
                                                 'L8', 'L6', 'L4', 'L2', 'L3', 'L1', 'L7', 'L5',
                                                 'I8', 'I6', 'I4', 'I2', 'I3', 'I1', 'I7', 'I5',
                                                 'IO8', 'IO6', 'IO4', 'IO2', 'IO3', 'IO1', 'IO7', 'IO5' ]);

        expect(componentExecutionPattern).toEqual([ 'L8c-entity2', 'L8c-entity6', 'L6c-entity4', 'L6c-entity5', 'L4c-entity4', 'L2c-entity1', 'L2c-entity3', 'L2c-entity4', 'L2c-entity5', 'L2c-entity6', 'L3c-entity1', 'L3c-entity4', 'L3c-entity5', 'L3c-entity6', 'L1c-entity1', 'L1c-entity4', 'L1c-entity5', 'L1c-entity6', 'L7c-entity6', 'L5c-entity4', 'L5c-entity5',
                                                    'L8c-entity2', 'L8c-entity6', 'L6c-entity4', 'L6c-entity5', 'L4c-entity4', 'L2c-entity1', 'L2c-entity3', 'L2c-entity4', 'L2c-entity5', 'L2c-entity6', 'L3c-entity1', 'L3c-entity4', 'L3c-entity5', 'L3c-entity6', 'L1c-entity1', 'L1c-entity4', 'L1c-entity5', 'L1c-entity6', 'L7c-entity6', 'L5c-entity4', 'L5c-entity5',
                                                    'L8c-entity2', 'L8c-entity6', 'L6c-entity4', 'L6c-entity5', 'L4c-entity4', 'L2c-entity1', 'L2c-entity3', 'L2c-entity4', 'L2c-entity5', 'L2c-entity6', 'L3c-entity1', 'L3c-entity4', 'L3c-entity5', 'L3c-entity6', 'L1c-entity1', 'L1c-entity4', 'L1c-entity5', 'L1c-entity6', 'L7c-entity6', 'L5c-entity4', 'L5c-entity5',
                                                    'L8c-entity2', 'L8c-entity6', 'L6c-entity4', 'L6c-entity5', 'L4c-entity4', 'L2c-entity1', 'L2c-entity3', 'L2c-entity4', 'L2c-entity5', 'L2c-entity6', 'L3c-entity1', 'L3c-entity4', 'L3c-entity5', 'L3c-entity6', 'L1c-entity1', 'L1c-entity4', 'L1c-entity5', 'L1c-entity6', 'L7c-entity6', 'L5c-entity4', 'L5c-entity5',
                                                    'L8c-entity2', 'L8c-entity6', 'L6c-entity4', 'L6c-entity5', 'L4c-entity4', 'L2c-entity1', 'L2c-entity3', 'L2c-entity4', 'L2c-entity5', 'L2c-entity6', 'L3c-entity1', 'L3c-entity4', 'L3c-entity5', 'L3c-entity6', 'L1c-entity1', 'L1c-entity4', 'L1c-entity5', 'L1c-entity6', 'L7c-entity6', 'L5c-entity4', 'L5c-entity5',
                                                    'I6c-entity5', 'I2c-entity6',
                                                    'IO8c-entity5', 'IO2c-entity5', 'IO2c-entity6', 'IO3c-entity5', 'IO3c-entity6', 'IO1c-entity5', 'IO1c-entity6', 'IO7c-entity5', 'IO5c-entity5'] );
      });

      window.performance.now = function() {
        return 0;
      }

      COMP();
    });

  });
  
});