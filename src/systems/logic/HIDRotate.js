'use strict';

// 3D position system
// -----------------------------------------
new COMP.System.Logic({
    name: 'HIDRotate',

    dependencies: ['OriginalObject', 'PlayerControl'],

    requiredDependencies: ['Object', 'HIDComboState', 'MouseState'],

    component: function () {
        return {
            pitchUpHandler: null,
            pitchDownHandler: null,
            yawRightHandler: null,
            yawLeftHandler: null,
            rollRightHandler: null,
            rollLeftHandler: null,
            velocity: 0.01
        };
    },

    process: function (entities) {
        _.each(entities, function (e) {
            var object = e.Object,
                HIDRotate = e.HIDRotate,
                isTriggered = e.HIDComboState.isTriggered,
                velocity = HIDRotate.velocity,
                mouseState = e.MouseState;

            if (isTriggered(HIDRotate.pitchUpHandler)) {
                object.rotateOnAxis(new THREE.Vector3(1, 0, 0), mouseState.movementY * velocity);
            }
                
            if (isTriggered(HIDRotate.pitchDownHandler)) {
                object.rotateOnAxis(new THREE.Vector3(1, 0, 0), mouseState.movementY * velocity);
            }

            if (isTriggered(HIDRotate.yawLeftHandler)) {
                object.rotateOnAxis(new THREE.Vector3(0, 1, 0), mouseState.movementX * velocity);
            }

            if (isTriggered(HIDRotate.yawRightHandler)) {
                object.rotateOnAxis(new THREE.Vector3(0, 1, 0), mouseState.movementX * velocity);
            }

            if (isTriggered(HIDRotate.rollLeftHandler)) {
                object.rotateOnAxis(new THREE.Vector3(1, 0, 0), mouseState.movementZ * velocity);
            }

            if (isTriggered(HIDRotate.rollRightHandler)) {
                object.rotateOnAxis(new THREE.Vector3(1, 0, 0), mouseState.movementZ * velocity);
            }
        });
    }
});