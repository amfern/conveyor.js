/*jshint bitwise: false*/
'use strict';

// Sets Transformer translate according to triggered combos
// -----------------------------------------
new CONV.System.Logic({
    name: 'HIDTranslateHorizontal',

    dependencies: [],

    requiredDependencies: ['Transformer', 'HIDComboState'],

    process: function (entities) {
        _.each(entities, function (e) {
            var Transformer = e.Transformer,
                HIDComboState = e.HIDComboState;

            Transformer.translation.x +=
                +_.contains(HIDComboState, 'moveRight') ||
                -_.contains(HIDComboState, 'moveLeft');
        });
    }
});
