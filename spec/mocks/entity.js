'use strict';

// mock system types to be deleted after each test
(function () {
    var entityConstructor = CONV.Entity;

    CONV.Entity = function () {
        entityConstructor.apply(this, arguments);
        CONV.Entity.mockedEntities.push(this);
    };
    CONV.Entity.mockedEntities = [];

    CONV.Entity.prototype = entityConstructor.prototype;
    CONV.Entity.prototype.originalRemove = CONV.Entity.prototype.remove;
    CONV.Entity.prototype.remove = function() {
        CONV.Entity.prototype.originalRemove.apply(this);
        CONV.Entity.mockedEntities.splice(CONV.Entity.mockedEntities.indexOf(this), 1);
    };

})();
