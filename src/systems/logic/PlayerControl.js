'use strict';

// 3D position system
// -----------------------------------------
new COMP.System.Logic({
    name: 'PlayerControl',

    dependencies: [],

    requiredDependencies: ['KeyBinds', 'HIDTranslate', 'HIDRotate'],

    component: function () {

    },

    process: function (entities) {
        _.each(entities, function (e) {
            // calculate current contols hash
            var HIDTranslate = e.HIDTranslate,
                HIDRotate = e.HIDRotate,
                keyBinds = e.KeyBinds;

            // yawRight
            HIDRotate.yawRightHandler = keyBinds.yawRight.handler;
            
            // yawLeft
            HIDRotate.yawLeftHandler = keyBinds.yawLeft.handler;

            // moveForward
            HIDTranslate.moveForwardHandler = keyBinds.moveForward.handler;

            // moveBack
            HIDTranslate.moveBackHandler = keyBinds.moveBack.handler;

            // moveLeft
            HIDTranslate.moveLeftHandler = keyBinds.moveLeft.handler;

            // moveRight
            HIDTranslate.moveRightHandler = keyBinds.moveRight.handler;

            // moveUp
            HIDTranslate.moveUpHandler = keyBinds.moveUp.handler;

            // moveDown
            HIDTranslate.moveDownHandler = keyBinds.moveDown.handler;
        });
    }
});
