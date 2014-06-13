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
            var RendererMeshes = entities[0].RendererMeshes;

            RendererMeshes = RendererMeshes.Mesh = [];

            _.each(entities, function (e) {
                var Mesh = e.Mesh,
                    TransformWorldInterpolation = e.TransformWorldInterpolation;
                
                Mesh.matrixWorld = TransformWorldInterpolation.matrix;
                
                RendererMeshes.push(Mesh);
            });
        }
    });
})();