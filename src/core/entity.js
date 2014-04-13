'use strict';

COMP.Entity = function (config) {
    // set defaults, unique entity name
    this.name = config.name || '';
    
    // collection of all components associated with this entity,
    // no need to specify dependencies. core will figure it out
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

COMP.StaticEntity = function (config) {
    COMP.Entity.call(this, config);
};
COMP.StaticEntity.prototype = {
    constructor: COMP.Entity
};