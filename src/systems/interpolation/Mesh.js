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

    new COMP.System.IO({
        name: 'Mesh',
        dependencies: ['ObjectInterpolation'],
        requiredDependencies: ['Renderer', 'ObjectInterpolation'],

        component: function () {
            return initialize();
        },

        process: function (entities) {
            _.each(entities, function (e) {
                var mesh = e.Mesh,
                    object = e.ObjectInterpolation,
                    scene = e.Renderer.scene;
                
                mesh.position    = object.position;
                mesh.rotation    = object.rotation;
                mesh.scale       = object.scale;
                mesh.quaternion  = object.quaternion;

                scene.add(mesh);
            });
        }
    });
})();