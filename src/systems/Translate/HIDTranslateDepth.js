/*jshint bitwise: false*/
'use strict';

// Sets Transformer translate according to triggered combos
// -----------------------------------------
new CONV.System.Logic({
    name: 'HIDTranslateDepth',

    dependencies: [],

    requiredDependencies: ['Transformer', 'HIDComboState'],

    process: function (entities) {
        _.each(entities, function (e) {
            var Transformer = e.Transformer,
                HIDComboState = e.HIDComboState;

            Transformer.translation.z +=
                -_.contains(HIDComboState, 'moveForward') ||
                +_.contains(HIDComboState, 'moveBack');
        });
    }
});
