'use strict';

// 3D position system
// -----------------------------------------
new COMP.System.IO({
    name: 'Camera',

    dependencies: ['Interpolate'],

    requiredDependencies: ['TransformWorldInterpolation', 'RendererCamera'],

    component: function () { },

    process: function (entities) {
        var entity = _.first(entities);

        if(!entity) {
            return;
        }

        var RendererCamera = entity.RendererCamera;

        RendererCamera.matrix = new THREE.Matrix4();
        RendererCamera.applyMatrix(entity.TransformWorldInterpolation.matrix);
    }
});