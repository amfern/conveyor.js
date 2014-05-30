/*jshint bitwise: false*/
'use strict';

// Wraps THREE.js as graphic output
// -----------------------------------------
(function () {
    function initialize() {
        var material, geometry;

        material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        geometry = new THREE.CubeGeometry(200, 200, 200);

        return new THREE.Mesh(geometry, material);
    }

    new COMP.System.Interpolate({
        name: 'Mesh',
        
        dependencies: ['Interpolate', 'RendererMeshes'],
        requiredDependencies: ['TransformWorldInterpolation', 'RendererMeshes'],

        component: function () {
            return initialize();
        },

        process: function (entities) {
            _.each(entities, function (e) {
                var RendererMeshes = e.RendererMeshes,
                    Mesh = e.Mesh,
                    TransformWorldInterpolation = e.TransformWorldInterpolation;
                
                // reset matrix
                Mesh.matrix = new THREE.Matrix4();

                // apply new matrix
                Mesh.applyMatrix(TransformWorldInterpolation.matrix);
                
                RendererMeshes.push(Mesh);
            });
        }
    });
})();