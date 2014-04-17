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
                isTriggered = e.HIDComboState.isTriggered,
                mouseState = e.MouseState;

            if (isTriggered(HIDRotate.pitchUpHandler) || isTriggered(HIDRotate.pitchDownHandler)) {
                rotation.y = -mouseState.movementY;
            }

            if (isTriggered(HIDRotate.yawLeftHandler) || isTriggered(HIDRotate.yawRightHandler)) {
                rotation.x = -mouseState.movementX;
            }

            if (isTriggered(HIDRotate.rollLeftHandler) || isTriggered(HIDRotate.rollRightHandler)) {
                rotation.z = -mouseState.movementZ;
            }
        });
    }
});