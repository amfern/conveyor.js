describe("core", function() {
  describe("register systems", function() {
    var systemLogic1, systemLogic2, systemLogic3, systemLogic4, systemLogic5, systemLogic6, systemLogic7, systemLogic8,
        systemIO1, systemIO2, systemIO3, systemIO4, systemIO5, systemIO6, systemIO7, systemIO8,
        systemExecutionPattern = [];

    beforeEach(function() {
    });

    it("should add system", function () {
      // Logic systems
      // -------------------------------------
      systemLogic1 = new comp.LogicSystem({
        name: 'EpicSystemLogic1',
        dependencies: ['systemLogic3', 'systemLogic2'], 
        component: function() { }, 
        proccess: function(entities) {
          systemExecutionPattern.push('L1');
        }
      });

      systemLogic2 = new comp.LogicSystem({
        name: 'EpicSystemLogic2',
        dependencies: [], 
        component: function() { }, 
        proccess: function(entities) {
          systemExecutionPattern.push('L2');
        }
      });

      systemLogic3 = new comp.LogicSystem({
        name: 'EpicSystemLogic3',
        dependencies: [], 
        component: function() { }, 
        proccess: function(entities) {
          systemExecutionPattern.push('L3');
        }
      });

      systemLogic4 = new comp.LogicSystem({
        name: 'EpicSystemLogic4',
        dependencies: [], 
        component: function() { }, 
        proccess: function(entities) {
          systemExecutionPattern.push('L4');
        }
      });

      systemLogic5 = new comp.LogicSystem({
        name: 'EpicSystemLogic5',
        dependencies: ['EpicSystemLogic1'], 
        component: function() { }, 
        proccess: function(entities) {
          systemExecutionPattern.push('L5');
        }
      });

      systemLogic6 = new comp.LogicSystem({
        name: 'EpicSystemLogic6',
        dependencies: ['NonExistandSystem1', 'NonExistandSystem2'], 
        component: function() { }, 
        proccess: function(entities) { 
          systemExecutionPattern.push('L6');
        }
      });

      systemLogic7 = new comp.LogicSystem({
        name: 'EpicSystemLogic7',
        dependencies: ['EpicSystemLogic8'], 
        component: function() { }, 
        proccess: function(entities) { 
          systemExecutionPattern.push('L7');
        }
      });

      systemLogic8 = new comp.LogicSystem({
        name: 'EpicSystemLogic8',
        dependencies: [], 
        component: function() { }, 
        proccess: function(entities) { 
          systemExecutionPattern.push('L8');
        }
      });


      // IO systems
      // -------------------------------------
      systemIO1 = new comp.IOSystem({
        name: 'EpicSystemIO1',
        dependencies: ['systemIO3', 'systemIO2'], 
        component: function() { }, 
        proccess: function(entities) {
          systemExecutionPattern.push('IO1');
        }
      });

      systemIO2 = new comp.IOSystem({
        name: 'EpicSystemIO2',
        dependencies: [], 
        component: function() { }, 
        proccess: function(entities) {
          systemExecutionPattern.push('IO2');
        }
      });

      systemIO3 = new comp.IOSystem({
        name: 'EpicSystemIO3',
        dependencies: [], 
        component: function() { }, 
        proccess: function(entities) {
          systemExecutionPattern.push('IO3');
        }
      });

      systemIO4 = new comp.IOSystem({
        name: 'EpicSystemIO4',
        dependencies: [], 
        component: function() { }, 
        proccess: function(entities) {
          systemExecutionPattern.push('IO4');
        }
      });

      systemIO5 = new comp.IOSystem({
        name: 'EpicSystemIO5',
        dependencies: ['EpicSystemIO1'], 
        component: function() { }, 
        proccess: function(entities) {
          systemExecutionPattern.push('IO5');
        }
      });

      systemIO6 = new comp.IOSystem({
        name: 'EpicSystemIO6',
        dependencies: ['NonExistandSystem1', 'NonExistandSystem2'], 
        component: function() { }, 
        proccess: function(entities) { 
          systemExecutionPattern.push('IO6');
        }
      });

      systemIO7 = new comp.IOSystem({
        name: 'EpicSystemIO7',
        dependencies: ['EpicSystemIO8'], 
        component: function() { }, 
        proccess: function(entities) { 
          systemExecutionPattern.push('IO7');
        }
      });

      systemIO8 = new comp.IOSystem({
        name: 'EpicSystemIO8',
        dependencies: [], 
        component: function() { }, 
        proccess: function(entities) { 
          systemExecutionPattern.push('IO8');
        }
      });

    });

    it("should throw exception for existance system name", function () {
      expect(comp.LogicSystem.bind( null, {
        name: 'EpicSystemLogic1',
        dependencies: [], 
        component: function() { }, 
        proccess: function(entities) { }
      } )).toThrow('system under name "EpicSystemLogic1" already exists');
      
      expect(comp.IOSystem.bind( null, {
        name: 'EpicSystemIO1',
        dependencies: [], 
        component: function() { }, 
        proccess: function(entities) { }
      } )).toThrow('system under name "EpicSystemIO1" already exists');
    });

    it("should throw exception for dependency containg system name", function () {
      expect(comp.LogicSystem.bind( null, {
        name: 'SameEpicSystemLogic',
        dependencies: ['SameEpicSystemLogic'], 
        component: function() { }, 
        proccess: function(entities) { }
      } )).toThrow('system cannot depend on it self');

      expect(comp.IOSystem.bind( null, {
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
        expect(systemExecutionPattern).toEqual([ 'L8', 'L7', 'L6', 'L4', 'L3', 'L2', 'L1', 'L5',
                                                 'IO8', 'IO7', 'IO6', 'IO4', 'IO3', 'IO2', 'IO1', 'IO5' ]);

        systemExecutionPattern = [];
        window.performance.now = function() {
          return Number.MAX_VALUE; // miliseconds
        }
        callback.call();

        // should execute logic systems maximum times to avoid spiral of death
        expect(systemExecutionPattern).toEqual([ 'L8', 'L7', 'L6', 'L4', 'L3', 'L2', 'L1', 'L5',
                                                 'L8', 'L7', 'L6', 'L4', 'L3', 'L2', 'L1', 'L5',
                                                 'L8', 'L7', 'L6', 'L4', 'L3', 'L2', 'L1', 'L5',
                                                 'L8', 'L7', 'L6', 'L4', 'L3', 'L2', 'L1', 'L5',
                                                 'L8', 'L7', 'L6', 'L4', 'L3', 'L2', 'L1', 'L5',
                                                 'IO8', 'IO7', 'IO6', 'IO4', 'IO3', 'IO2', 'IO1', 'IO5' ]);

      });

      window.performance.now = function() {
        return 0;
      }

      comp();
    });

  });
  
});