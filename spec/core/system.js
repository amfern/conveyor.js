describe('System', function() {
  var genericSystem, config;

  beforeEach(function() {
    spyOn(COMP, '_registerLogicSystem');
    spyOn(COMP, '_registerIOSystem');
  });

  it('should register logic system with core', function () {
    config = {
      name: 'EpicLogicSystem',
      dependencies: [], 
      component: function() { }, 
      proccess: function(entities) { }
    };

    genericSystem = new COMP.System.Logic(config);
    expect(COMP._registerLogicSystem).toHaveBeenCalledWith({
      name: 'EpicLogicSystem',
      dependencies: [], 
      component: config.component, 
      entities: [],
      proccess: config.proccess
    });
  });

  it('should register IO system with core', function () {
    config = {
      name: 'EpicIOSystem',
      dependencies: [], 
      component: function() { }, 
      proccess: function(entities) { }
    };

    genericSystem = new COMP.System.IO(config);
    expect(COMP._registerIOSystem).toHaveBeenCalledWith({
      name: 'EpicIOSystem',
      dependencies: [], 
      component: config.component, 
      entities: [],
      proccess: config.proccess
    });
  });

  it('should raise exception for missing proccess function', function () {
    expect( COMP.System.bind(null, { name: "epicName" }) ).toThrow('proccess function is mandatory');
  });

  it('should raise exception for missing name', function () {
    expect( COMP.System.bind(null, { proccess: function() {} }) ).toThrow('empty system name is not allowed');
  });

  describe('new system', function() {
    beforeEach(function() {
      config = {
        name: 'epicGenericName',
        proccess: function(entities) { }
      };

      genericSystem = new COMP.System(config);
    });

    it('should fill default dependencies', function () {
      expect(genericSystem.dependencies).toEqual([]);
    });
  
    it('should fill default component function', function () {
      expect(typeof(genericSystem.component)).toEqual('function');
    });
  
  });
});