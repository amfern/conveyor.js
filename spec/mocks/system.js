'use strict';

// mock system types to be deleted after each test
(function () {
    var logicConstructor = COMP.System.Logic,
        InterpolateConstructor = COMP.System.Interpolate,
        IOConstructor = COMP.System.IO;

    COMP.System.Logic = function () {
        logicConstructor.apply(this, arguments);
        COMP.System.mockedSystems.push(this);
    };
    COMP.System.Logic.prototype = logicConstructor.prototype;
    COMP.System.Logic.prototype.originalRemove = COMP.System.Logic.prototype.remove;
    COMP.System.Logic.prototype.remove = function() {
        COMP.System.Logic.prototype.originalRemove.apply(this);
        COMP.System.mockedSystems.splice(COMP.System.mockedSystems.indexOf(this), 1);
    };

    COMP.System.Interpolate = function () {
        InterpolateConstructor.apply(this, arguments);
        COMP.System.mockedSystems.push(this);
    };
    COMP.System.Interpolate.prototype = InterpolateConstructor.prototype;
    COMP.System.Interpolate.prototype.originalRemove = COMP.System.Interpolate.prototype.remove;
    COMP.System.Interpolate.prototype.remove = function() {
        COMP.System.Interpolate.prototype.originalRemove.apply(this);
        COMP.System.mockedSystems.splice(COMP.System.mockedSystems.indexOf(this), 1);
    };

    COMP.System.IO = function () {
        IOConstructor.apply(this, arguments);
        COMP.System.mockedSystems.push(this);
    };
    COMP.System.IO.prototype = IOConstructor.prototype;
    COMP.System.IO.prototype.originalRemove = COMP.System.IO.prototype.remove;
    COMP.System.IO.prototype.remove = function() {
        COMP.System.IO.prototype.originalRemove.apply(this);
        COMP.System.mockedSystems.splice(COMP.System.mockedSystems.indexOf(this), 1);
    };


    COMP.System.mockedSystems = [];
})();