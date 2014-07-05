'use strict';

COMP.Entity = function (config) {
    // set defaults, unique entity name
    this.name = config.name || '';
    
    // collection of all components associated with this entity,
    // no need to specify dependencies, core will figure it out.
    // it could come in a form of array or object containing initial values.
    // thus values must be of object type or array
    // for the components eg.:
    // {
    //     component1: {
    //         initialValue: 1
    //     }
    // }
    this.components = config.components || [];

    COMP._registerEntity(this);
};
COMP.Entity.prototype = {
    constructor: COMP.Entity,

    remove: function () {
        COMP._unregisterEntity(this);
    },

    update: function () {
        return COMP._updateEntity(this);
    }
};