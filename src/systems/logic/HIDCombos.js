'use strict';

// Collection of combos(for use with HIDComboState)
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