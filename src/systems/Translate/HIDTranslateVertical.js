/*jshint bitwise: false*/
'use strict';

// Sets Transformer translate according to triggered combos
// -----------------------------------------
new CONV.System.Logic({
    name: 'HIDTranslateVertical',

    dependencies: [],

    requiredDependencies: ['Transformer', 'HIDComboState'],

    process: function (entities) {
        _.each(entities, function (e) {
            var Transformer = e.Transformer,
                HIDComboState = e.HIDComboState;

            Transformer.translation.y +=
                +_.contains(HIDComboState, 'moveUp') ||
                -_.contains(HIDComboState, 'moveDown');
        });
    }
});
