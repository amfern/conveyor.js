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
                HIDComboState = e.HIDComboState,
                defaultTriggered = {triggered: false},
                moveForward = HIDComboState[HIDTranslate.moveForwardHandler] || defaultTriggered,
                moveBack = HIDComboState[HIDTranslate.moveBackHandler] || defaultTriggered,
                moveLeft = HIDComboState[HIDTranslate.moveLeftHandler] || defaultTriggered,
                moveRight = HIDComboState[HIDTranslate.moveRightHandler] || defaultTriggered,
                moveUp = HIDComboState[HIDTranslate.moveUpHandler] || defaultTriggered,
                moveDown = HIDComboState[HIDTranslate.moveDownHandler] || defaultTriggered;

            translate.x = +!!moveRight.triggered;
            translate.x = translate.x || -!!moveLeft.triggered;

            translate.y = +!!moveUp.triggered;
            translate.y = translate.y || -!!moveDown.triggered;

            translate.z = -!!moveForward.triggered;
            translate.z = translate.z || +!!moveBack.triggered;

            translate.normalize();
        });
    }
});