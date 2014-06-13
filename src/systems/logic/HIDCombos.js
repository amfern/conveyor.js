'use strict';

// 3D position system
// -----------------------------------------
(function () {
    var component = {};

    new COMP.System.Logic({
        name: 'HIDCombos',

        isStatic: true,

        component: function () {
            return component;
        },

        process: function () { }
    });
})();