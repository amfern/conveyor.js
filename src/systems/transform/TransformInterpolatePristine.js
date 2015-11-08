'use strict';

// 3D world position system before engine cycle has changed it
// -----------------------------------------
new CONV.System.Logic({
    name: 'TransformInterpolatePristine',

    dependencies: [],

    requiredDependencies: ['TransformInterpolate'],

    process: function (entities) {
        _.each(entities, function (e) {
            var TransformInterpolate = e.TransformInterpolate;

            e.TransformInterpolatePristine = {
                position: TransformInterpolate.position.clone(),
                rotate: TransformInterpolate.rotate.clone(),
                scale: TransformInterpolate.scale.clone()
            };
        });
    }
});
