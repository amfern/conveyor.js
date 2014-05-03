'use strict';

// 3D position system
// -----------------------------------------
new COMP.System.Logic({
    name: 'HIDTranslate',

    dependencies: ['Transformer', 'PlayerControl'],

    requiredDependencies: ['Transformer', 'HIDComboState'],

    component: function () {
        return {
            moveForwardHandler: null,
            moveBackHandler: null,
            moveLeftHandler: null,
            moveRightHandler: null,
            moveUpHandler: null,
            moveDownHandler: null
        };
    },

    process: function (entities) {
        _.each(entities, function (e) {
            var translate = e.Transformer.position,
                HIDTranslate = e.HIDTranslate,
                isTriggered = e.HIDComboState.isTriggered;

            translate.x = +isTriggered(HIDTranslate.moveRightHandler);
            translate.x = translate.x || -isTriggered(HIDTranslate.moveLeftHandler);

            translate.y = +isTriggered(HIDTranslate.moveUpHandler);
            translate.y = translate.y || -isTriggered(HIDTranslate.moveDownHandler);

            translate.z = -isTriggered(HIDTranslate.moveForwardHandler);
            translate.z = translate.z || +isTriggered(HIDTranslate.moveBackHandler);

            translate.normalize();
        });
    }
});