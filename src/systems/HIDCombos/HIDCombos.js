'use strict';

// Collection of combos(for use with HIDComboState)
// -----------------------------------------
(function () {
    var component = {};

    new CONV.System.Logic({
        name: 'HIDCombos',

        isStatic: true,

        component: function () {
            return component;
        }
    });
})();
