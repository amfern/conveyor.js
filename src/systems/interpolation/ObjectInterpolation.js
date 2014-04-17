'use strict';

// Object3D interpolate  system
// -----------------------------------------
new COMP.System.Interpolate({
    name: 'ObjectInterpolation',

    requiredDependencies: ['OriginalObject'],

    component: function () {},

    process: function (entities, interpolation) {
        var before, current, after;

        _.each(entities, function (e) {
            before = e.OriginalObject;
            current = e.Object;
            after = e.ObjectInterpolation = current.clone();

            after.scale.lerp(before.scale, 1 - interpolation);
            after.position.lerp(before.position, 1 - interpolation);
            after.quaternion.slerp(before.quaternion, 1 - interpolation);
        });
    },
});