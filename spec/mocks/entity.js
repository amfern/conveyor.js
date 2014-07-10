'use strict';

// mock system types to be deleted after each test
(function () {
    var entityConstructor = COMP.Entity;

    COMP.Entity = function () {
        entityConstructor.apply(this, arguments);
        COMP.Entity.mockedEntities.push(this);
    };
    COMP.Entity.mockedEntities = [];

    COMP.Entity.prototype = entityConstructor.prototype;
    COMP.Entity.prototype.originalRemove = COMP.Entity.prototype.remove;
    COMP.Entity.prototype.remove = function() {
        COMP.Entity.prototype.originalRemove.apply(this);
        COMP.Entity.mockedEntities.splice(COMP.Entity.mockedEntities.indexOf(this), 1);
    };

})();