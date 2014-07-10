'use strict';

// mock system types to be deleted after each test
(function () {
    var logicConstructor = CONV.System.Logic,
        InterpolateConstructor = CONV.System.Interpolate,
        IOConstructor = CONV.System.IO;

    CONV.System.Logic = function () {
        logicConstructor.apply(this, arguments);
        CONV.System.mockedSystems.push(this);
    };
    CONV.System.Logic.prototype = logicConstructor.prototype;
    CONV.System.Logic.prototype.originalRemove = CONV.System.Logic.prototype.remove;
    CONV.System.Logic.prototype.remove = function() {
        CONV.System.Logic.prototype.originalRemove.apply(this);
        CONV.System.mockedSystems.splice(CONV.System.mockedSystems.indexOf(this), 1);
    };

    CONV.System.Interpolate = function () {
        InterpolateConstructor.apply(this, arguments);
        CONV.System.mockedSystems.push(this);
    };
    CONV.System.Interpolate.prototype = InterpolateConstructor.prototype;
    CONV.System.Interpolate.prototype.originalRemove = CONV.System.Interpolate.prototype.remove;
    CONV.System.Interpolate.prototype.remove = function() {
        CONV.System.Interpolate.prototype.originalRemove.apply(this);
        CONV.System.mockedSystems.splice(CONV.System.mockedSystems.indexOf(this), 1);
    };

    CONV.System.IO = function () {
        IOConstructor.apply(this, arguments);
        CONV.System.mockedSystems.push(this);
    };
    CONV.System.IO.prototype = IOConstructor.prototype;
    CONV.System.IO.prototype.originalRemove = CONV.System.IO.prototype.remove;
    CONV.System.IO.prototype.remove = function() {
        CONV.System.IO.prototype.originalRemove.apply(this);
        CONV.System.mockedSystems.splice(CONV.System.mockedSystems.indexOf(this), 1);
    };


    CONV.System.mockedSystems = [];
})();