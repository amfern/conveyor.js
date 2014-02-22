'use strict';

// mock system types to be deleted after each test
(function () {
    var entityConstructor = COMP.Entity,
        staticEntityConstructor = COMP.StaticEntity;

    COMP.Entity = function () {
        entityConstructor.apply(this, arguments);
        COMP.Entity.mockedEntities.push(this);
    };
    COMP.Entity.prototype = entityConstructor.prototype;

    COMP.StaticEntity = function () {
        staticEntityConstructor.apply(this, arguments);
        COMP.Entity.mockedEntities.length--; // remove static entity from mocked entities, it cannot be deleted
    };
    COMP.StaticEntity.prototype = staticEntityConstructor.prototype;

    COMP.Entity.mockedEntities = [];
})();