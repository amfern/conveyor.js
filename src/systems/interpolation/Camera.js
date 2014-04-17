'use strict';

// 3D position system
// -----------------------------------------
new COMP.System.IO({
    name: 'Camera',

    dependencies: ['ObjectInterpolation'],

    requiredDependencies: ['ObjectInterpolation', 'Renderer'],

    component: function () { },

    // process: function () {  }

    process: function (entities) {
        _.each(entities, function (e) {
            var object = e.ObjectInterpolation,
                camera = e.Renderer.camera;

            camera.position    = object.position.clone();
            camera.rotation    = object.rotation.clone();
            camera.scale       = object.scale.clone();
            camera.quaternion  = object.quaternion.clone();
        });
    }
});