'use strict';

// Object3D interpolate  system
// -----------------------------------------
new CONV.System.Interpolate({
    name: 'Interpolate',

    dependencies: ['TransformInterpolation'],

    requiredDependencies: ['TransformInterpolation', 'TransformPristine'],

    process: function (entities, interpolation) {
        var before, after;

        _.each(entities, function (e) {
            before = e.TransformPristine;
            after = e.TransformInterpolation;

            after.scale.lerp(before.scale, 1 - interpolation);
            after.position.lerp(before.position, 1 - interpolation);
            after.quaternion.slerp(before.quaternion, 1 - interpolation);

            after.updateMatrix();
        });
    },
});
