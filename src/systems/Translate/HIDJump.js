/*jshint bitwise: false*/
'use strict';

//
// -----------------------------------------
new CONV.System.Logic({
    name: 'HIDJump',

    dependencies: ['Velocity', 'AngularVelocity'],

    requiredDependencies: ['Transform', 'Transformer', 'HIDComboState'],

    process: function (entities) {
        var jumpDirection = new THREE.Vector3(0, 20, 0);
        _.each(entities, function (e) {
            var Transformer = e.Transformer,
                HIDComboState = e.HIDComboState,
                Transform = e.Transform;

            if (_.contains(HIDComboState, 'moveJump')) {
                jumpDirection.applyQuaternion(Transform.rotate);
                Transformer.translation.add(jumpDirection);
            }
        });
    }
});
