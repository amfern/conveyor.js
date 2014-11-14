'use strict';

CONV.System = function (config) {
    if (_.isEmpty(config.name)) {
        throw new Error('empty system name is not allowed');
    }

    // invalid system names
    _.each(['name', 'dependencies', 'entities', 'component', 'process', 'yield'], function (name) {
        if (config.name === name) { throw new Error('"' + name + '" is saved system name'); }
    });

    // set defaults
    this.name = config.name;
    
    // static system have no need to process other entities, they have one entity.
    // that entity is shared between all static systems and created upon engine initialization
    this.isStatic = config.isStatic || false;

    // new component generator for this system
    this.component = config.component;
    this.process = config.process;

    // components thats are required by system proccess function to run
    this.requiredDependencies = config.requiredDependencies || [];

    // systems that should run before this one
    this.dependencies = config.dependencies || [];

    this.dependencies = _.uniq(this.requiredDependencies.concat(this.dependencies));
    
    // if process function spawns thread inside its up to the developer to call 
    // yield when done processing
    this.thread = config.thread || false;
    
    // ran by engine when it first starts
    this.initialize = config.initialize || function () {};
    this.entities = [];
};

// Logic
// --------------------------

CONV.System.Logic = function (config) {
    CONV.System.call(this, config);
    CONV._registerLogicSystem(this);
};

CONV.System.Logic.prototype = {
    constructor: CONV.System.Logic,
    remove: function () {
        CONV._unregisterLogicSystem(this);
    }
};

// Interpolate
// --------------------------

CONV.System.Interpolate = function (config) {
    CONV.System.call(this, config);
    CONV._registerInterpolateSystem(this);
};

CONV.System.Interpolate.prototype = {
    constructor: CONV.System.Interpolate,
    remove: function () {
        CONV._unregisterInterpolateSystem(this);
    }
};

// IO
// --------------------------

CONV.System.IO = function (config) {
    CONV.System.call(this, config);
    CONV._registerIOSystem(this);
};

CONV.System.IO.prototype = {
    constructor: CONV.System.IO,
    remove: function () {
        CONV._unregisterIOSystem(this);
    }
};