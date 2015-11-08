'use strict';

// Transform interpolate system
// -----------------------------------------
new CONV.System.Interpolate({
    name: 'Interpolate',

    requiredDependencies: ['TransformInterpolate', 'TransformInterpolatePristine', 'TransformMatrix'],

    process: function (entities, interpolation) {
        _.each(entities, function (e) {
            var before = e.TransformInterpolatePristine,
                after = e.TransformInterpolate,
                beforePosition = before.position,
                beforeRotate = before.rotate,
                beforeScale = before.scale,
                afterPosition = after.position,
                afterRotate = after.rotate,
                afterScale = after.scale;

            afterPosition.lerp(beforePosition, 1 - interpolation);
            afterRotate.slerp(beforeRotate, 1 - interpolation);
            afterScale.lerp(beforeScale, 1 - interpolation);
            e.TransformMatrix.compose(afterPosition, afterRotate, afterScale);
        });
    },
});
