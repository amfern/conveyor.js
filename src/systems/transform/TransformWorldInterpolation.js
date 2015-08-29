'use strict';

// 3D world position for interpolation systems to use
// -----------------------------------------
new CONV.System.Interpolate({
    name: 'TransformWorldInterpolation',

    requiredDependencies: ['TransformWorld'],

    component: function () {
        return new THREE.Object3D();
    }
});
