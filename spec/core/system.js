describe('_System', function() {
  var genericSystem, config;

  beforeEach(function() {
    spyOn(comp, '_registerLogicSystem');
    spyOn(comp, '_registerIOSystem');

    spyOn(comp, '_System').andCallThrough();
  });

  it('should register logic system with core', function () {
    config = {
      name: 'EpicLogicSystem',
      dependencies: [], 
      component: function() { }, 
      proccess: function(entities) { }
    };

    genericSystem = new comp.LogicSystem(config);
    expect(comp._registerLogicSystem).toHaveBeenCalledWith({
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

    genericSystem = new comp.IOSystem(config);
    expect(comp._registerIOSystem).toHaveBeenCalledWith({
      name: 'EpicIOSystem',
      dependencies: [], 
      component: config.component, 
      entities: [],
      proccess: config.proccess
    });
  });

  it('should raise exception for missing proccess function', function () {
    expect( comp._System.bind(null, { name: "epicName" }) ).toThrow('proccess function is mandatory');
  });

  it('should raise exception for missing name', function () {
    expect( comp._System.bind(null, { proccess: function() {} }) ).toThrow('empty system name is not allowed');
  });

  describe('new system', function() {
    beforeEach(function() {
      config = {
        name: 'epicGenericName',
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