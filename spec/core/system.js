describe('_System', function() {
  var genericSystem, config;

  beforeEach(function() {
    spyOn(comp, '_registerLogicSystem');
    spyOn(comp, '_registerIOSystem');
  });

  it('should register logic system with core', function () {
    config = {
      name: 'EpicSystem',
      dependencies: [], 
      component: function() { }, 
      proccess: function(entities) { }
    };

    genericSystem = new comp.LogicSystem(config);
    expect(comp._registerLogicSystem).toHaveBeenCalledWith(config);
  });

  it('should register IO system with core', function () {
    config = {
      name: 'EpicSystem',
      dependencies: [], 
      component: function() { }, 
      proccess: function(entities) { }
    };

    genericSystem = new comp.IOSystem(config);
    expect(comp._registerIOSystem).toHaveBeenCalledWith(config);
  });

  it('should raise exception for missing proccess function', function () {
    expect(comp._System).toThrow('proccess function is mandatory');
  });

  describe('new system', function() {
    beforeEach(function() {
      config = {
        proccess: function(entities) { }
      };

      genericSystem = new comp._System(config);
    });

    it('should fill default dependencies', function () {
      expect(genericSystem.dependencies).toEqual([]);
    });
  
    it('should fill default component function', function () {
      expect(typeof(genericSystem.component)).toEqual('function');
    });
  
  });
});