'use strict';

// 3D position system
// -----------------------------------------
(function () {

    // returns new HIDCombo handler
    function updateControl(HIDComboState, handler, combo) {
        if (handler !== null) {
            return handler;
        }

        return HIDComboState.register({ keys: combo });
    }

    new COMP.System.Logic({
        name: 'PlayerControl',

        dependencies: [],

        requiredDependencies: ['HIDComboState', 'HIDTranslate', 'HIDRotate'],

        component: function () {
            return {
                controlsHash: '',
                controls: {
                    moveForwardCombo: ['k87'],
                    moveBackCombo: ['k83'],
                    moveLeftCombo: ['k65'],
                    moveRightCombo: ['k68'],
                    moveUpCombo: ['k32'],
                    moveDownCombo: ['k67'],

                    pitchUpCombo: ['mmovedUp'],
                    pitchDownCombo: ['mmovedDown'],
                    yawRightCombo: ['mmovedRight'],
                    yawLeftCombo: ['mmovedLeft'],
                    rollRightCombo: [],
                    rollLeftCombo: []
                }
            };
        },

        process: function (entities) {
            _.each(entities, function (e) {
                // calculate current contols hash
                var playerControl = e.PlayerControl,
                    HIDTranslate = e.HIDTranslate,
                    HIDRotate = e.HIDRotate,
                    HIDComboState = e.HIDComboState;

                // pitchUp
                HIDRotate.pitchUpHandler = updateControl(
                    HIDComboState,
                    HIDRotate.pitchUpHandler,
                    playerControl.controls.pitchUpCombo
                );

                // pitchDown
                HIDRotate.pitchDownHandler = updateControl(
                    HIDComboState,
                    HIDRotate.pitchDownHandler,
                    playerControl.controls.pitchDownCombo
                );

                // yawRight
                HIDRotate.yawRightHandler = updateControl(
                    HIDComboState,
                    HIDRotate.yawRightHandler,
                    playerControl.controls.yawRightCombo
                );
                
                // yawLeft
                HIDRotate.yawLeftHandler = updateControl(
                    HIDComboState,
                    HIDRotate.yawLeftHandler,
                    playerControl.controls.yawLeftCombo
                );

                // // rollRight
                // HIDRotate.rollRightHandler = updateControl(
                //     HIDComboState,
                //     HIDRotate.rollRightHandler,
                //     playerControl.controls.rollRightCombo
                // );

                // // rollLeft
                // HIDRotate.rollLeftHandler = updateControl(
                //     HIDComboState,
                //     HIDRotate.rollLeftHandler,
                //     playerControl.controls.rollLeftCombo
                // );

                // moveForward
                HIDTranslate.moveForwardHandler = updateControl(
                    HIDComboState,
                    HIDTranslate.moveForwardHandler,
                    playerControl.controls.moveForwardCombo
                );

                // moveBack
                HIDTranslate.moveBackHandler = updateControl(
                    HIDComboState,
                    HIDTranslate.moveBackHandler,
                    playerControl.controls.moveBackCombo
                );

                // moveLeft
                HIDTranslate.moveLeftHandler = updateControl(
                    HIDComboState,
                    HIDTranslate.moveLeftHandler,
                    playerControl.controls.moveLeftCombo
                );

                // moveRight
                HIDTranslate.moveRightHandler = updateControl(
                    HIDComboState,
                    HIDTranslate.moveRightHandler,
                    playerControl.controls.moveRightCombo
                );

                // moveUp
                HIDTranslate.moveUpHandler = updateControl(
                    HIDComboState,
                    HIDTranslate.moveUpHandler,
                    playerControl.controls.moveUpCombo
                );

                // moveDown
                HIDTranslate.moveDownHandler = updateControl(
                    HIDComboState,
                    HIDTranslate.moveDownHandler,
                    playerControl.controls.moveDownCombo
                );
            });
        }
    });
})();