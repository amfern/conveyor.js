'use strict';

// 3D position system
// -----------------------------------------
new COMP.System.Logic({
    name: 'HIDRotate',

    dependencies: ['Transformer', 'PlayerControl'],

    requiredDependencies: ['Transformer', 'HIDComboState', 'MouseState'],

    component: function () {
        return {
            pitchUpHandler: null,
            pitchDownHandler: null,
            yawRightHandler: null,
            yawLeftHandler: null,
            rollRightHandler: null,
            rollLeftHandler: null
        };
    },

    process: function (entities) {
        _.each(entities, function (e) {
            var rotation = e.Transformer.rotation,
                HIDRotate = e.HIDRotate,
                HIDComboState = e.HIDComboState,
                mouseState = e.MouseState,
                defaultTriggered = {triggered: false},
                pitchUp = HIDComboState[HIDRotate.pitchUpHandler] || defaultTriggered,
                pitchDown = HIDComboState[HIDRotate.pitchDownHandler] || defaultTriggered,
                yawRight = HIDComboState[HIDRotate.yawRightHandler] || defaultTriggered,
                yawLeft = HIDComboState[HIDRotate.yawLeftHandler] || defaultTriggered,
                rollRight = HIDComboState[HIDRotate.rollRightHandler] || defaultTriggered,
                rollLeft = HIDComboState[HIDRotate.rollLeftHandler] || defaultTriggered;


            if (pitchUp.triggered || pitchDown.triggered) {
                rotation.y = -mouseState.movementY;
            }

            if (yawLeft.triggered || yawRight.triggered) {
                rotation.x = -mouseState.movementX;
            }

            if (rollLeft.triggered || rollRight.triggered) {
                rotation.z = -mouseState.movementZ;
            }
        });
    }
});