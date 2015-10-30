'use strict';

// Uses Transformer to translate along the xyz axis
// -----------------------------------------
new CONV.System.Logic({
    name: 'Translate',

    dependencies: ['Transformer', 'HIDTranslate', 'Rotate', 'TransformPristine'],

    requiredDependencies: ['Transform', 'Transformer'],

    component: function () {
        return {
            velocity: 10
        };
    },

    process: function (entities) {
        _.each(entities, function (e) {
            var position = e.Transform.position,
                rotate = e.Transform.rotate,
                translation = e.Transformer.translation,
                velocity = e.Translate.velocity,
                directionalTranslate = new THREE.Vector3();

            directionalTranslate.copy(translation).normalize().applyQuaternion(rotate);

	    position.add(directionalTranslate.multiplyScalar(velocity));
        });
    }
});
