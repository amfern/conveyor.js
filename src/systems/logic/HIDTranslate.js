'use strict';

// 3D position system
// -----------------------------------------
new COMP.System.Logic({
    name: 'HIDTranslate',

    dependencies: ['OriginalObject', 'PlayerControl', 'HIDRotate'],

    requiredDependencies: ['Object', 'HIDComboState'],

    component: function () {
        return {
            moveForwardHandler: null,
            moveBackHandler: null,
            moveLeftHandler: null,
            moveRightHandler: null,
            moveUpHandler: null,
            moveDownHandler: null,
            velocity: 10
        };
    },

    process: function (entities) {
        _.each(entities, function (e) {
            var translate = new THREE.Vector3(),
                object = e.Object,
                HIDTranslate = e.HIDTranslate,
                velocity = HIDTranslate.velocity,
                isTriggered = e.HIDComboState.isTriggered;

            translate.z = -isTriggered(HIDTranslate.moveForwardHandler);
            translate.z = translate.z || +isTriggered(HIDTranslate.moveBackHandler);

            translate.x = +isTriggered(HIDTranslate.moveRightHandler);
            translate.x = translate.x || -isTriggered(HIDTranslate.moveLeftHandler);

            translate.y = +isTriggered(HIDTranslate.moveUpHandler);
            translate.y = translate.y || -isTriggered(HIDTranslate.moveDownHandler);

            translate.normalize();

            object.translateX(translate.x * velocity);
            object.translateY(translate.y * velocity);
            object.translateZ(translate.z * velocity);
        });
    }
});