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

    new CONV.System.Interpolate({
        name: 'Mesh',

        dependencies: ['HierarchyInterpolate'],
        requiredDependencies: ['RendererMeshes', 'TransformMatrix'],

        component: function () {
            return initialize();
        },

        process: function (entities) {
            var entity = _.first(entities),
                RendererMeshes;

            if (!entity) {
                return;
            }

            RendererMeshes = entity.RendererMeshes;
            RendererMeshes = RendererMeshes.Mesh = [];

            _.each(entities, function (e) {
                var Mesh = e.Mesh;

                Mesh.matrixWorld.copy(e.TransformMatrix);

                RendererMeshes.push(Mesh);
            });
        }
    });
})();
