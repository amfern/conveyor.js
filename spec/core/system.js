describe('System', function() {
  var genericSystem, config;

  beforeEach(function() {
    spyOn(COMP, '_registerLogicSystem');
    spyOn(COMP, '_registerInterpolateSystem');
    spyOn(COMP, '_registerIOSystem');
  });

  it('should register logic system with core', function () {
    config = {
      name: 'EpicLogicSystem',
      dependencies: [], 
      thread: true,
      component: function() { }, 
      process: function(entities) { }
    };

    genericSystem = new COMP.System.Logic(config);
    expect(COMP._registerLogicSystem).toHaveBeenCalledWith({
      name: 'EpicLogicSystem',
      isStatic: false,
      dependencies: [], 
      component: config.component, 
      entities: [],
      thread: true,
      process: config.process
    });
  });

  it('should register Interpolate system with core', function () {
    config = {
      name: 'EpicInterplateSystem',
      dependencies: [], 
      component: function() { }, 
      process: function(entities) { }
    };

    genericSystem = new COMP.System.Interpolate(config);
    expect(COMP._registerInterpolateSystem).toHaveBeenCalledWith({
      name: 'EpicInterplateSystem',
      isStatic: false,
      dependencies: [], 
      component: config.component, 
      entities: [],
      thread: false,
      process: config.process
    });
  });

  it('should register IO system with core', function () {
    config = {
      name: 'EpicIOSystem',
      dependencies: [], 
      component: function() { }, 
      process: function(entities) { }
    };

    genericSystem = new COMP.System.IO(config);
    expect(COMP._registerIOSystem).toHaveBeenCalledWith({
      name: 'EpicIOSystem',
      isStatic: false,
      dependencies: [], 
      component: config.component, 
      entities: [],
      thread: false,
      process: config.process
    });
  });

  it('should raise exception for system name == "name"', function () {
    expect( COMP.System.bind(null, { name: "name" }) ).toThrow('"name" is saved system name');
  });

  it('should raise exception for system name == "dependencies"', function () {
    expect( COMP.System.bind(null, { name: "dependencies" }) ).toThrow('"dependencies" is saved system name');
  });

  it('should raise exception for system name == "entities"', function () {
    expect( COMP.System.bind(null, { name: "entities" }) ).toThrow('"entities" is saved system name');
  });

  it('should raise exception for system name == "component"', function () {
    expect( COMP.System.bind(null, { name: "component" }) ).toThrow('"component" is saved system name');
  });

  it('should raise exception for system name == "process"', function () {
    expect( COMP.System.bind(null, { name: "process" }) ).toThrow('"process" is saved system name');
  });

  it('should raise exception for system name == "yield"', function () {
    expect( COMP.System.bind(null, { name: "yield" }) ).toThrow('"yield" is saved system name');
  });

  it('should raise exception for missing process function', function () {
    expect( COMP.System.bind(null, { name: "epicName" }) ).toThrow('process function is mandatory');
  });

  it('should raise exception for missing name', function () {
    expect( COMP.System.bind(null, { process: function() {} }) ).toThrow('empty system name is not allowed');
  });

  describe('new system', function() {
    beforeEach(function() {
      config = {
        name: 'epicGenericName',
        process: function(entities) { }
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