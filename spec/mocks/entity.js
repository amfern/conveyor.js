'use strict';

// mock system types to be deleted after each test
(function () {
    var entityConstructor = COMP.Entity;

    COMP.Entity = function () {
        entityConstructor.apply(this, arguments);
        COMP.Entity.mockedEntities.push(this);
    };
    COMP.Entity.prototype = entityConstructor.prototype;

    COMP.Entity.mockedEntities = [];
})();