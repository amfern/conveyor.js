/*jshint bitwise: false*/
'use strict';

// Wraps THREE.js as graphic output
// -----------------------------------------
(function () {
    function newMaterial() {
        return new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    }

    function newGeometry() {
        return new THREE.BoxGeometry(1, 1, 1);
    }

    new CONV.System.Interpolate({
        name: 'Mesh',

        dependencies: ['HierarchyInterpolate'],
        requiredDependencies: ['RendererMeshes', 'TransformMatrix'],

        component: function (params) {
            params = params || {};

            return new THREE.Mesh(params.geometry || newGeometry(),
                                  params.material || newMaterial());
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
