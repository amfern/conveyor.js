'use strict';

// 3D Transform matrix
// -----------------------------------------
new CONV.System.Logic({
    name: 'TransformMatrix',

    dependencies: ['Rotate', 'Translate'],

    requiredDependencies: ['Transform'],

    process: function (entities) {
        _.each(entities, function (e) {
            var Transform = e.Transform;

            e.TransformMatrix = new THREE.Matrix4().compose(
                Transform.position,
                Transform.rotate,
                Transform.scale
            );
        });
    }
});
