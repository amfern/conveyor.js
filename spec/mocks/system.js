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

    COMP.System.Interpolate = function () {
        InterpolateConstructor.apply(this, arguments);
        COMP.System.mockedSystems.push(this);
    };
    COMP.System.Interpolate.prototype = InterpolateConstructor.prototype;

    COMP.System.IO = function () {
        IOConstructor.apply(this, arguments);
        COMP.System.mockedSystems.push(this);
    };
    COMP.System.IO.prototype = IOConstructor.prototype;

    COMP.System.mockedSystems = [];
})();