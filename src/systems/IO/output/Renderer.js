'use strict';

// Renderer system
// -----------------------------------------
(function () {
    var component;

    function initialize() {
        var renderer = new THREE.WebGLRenderer();
            
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.autoClear = false;

        window.document.addEventListener('DOMContentLoaded', function () {
            window.document.body.appendChild(renderer.domElement);
        });

        return renderer;
    }

    component = {
        camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000),
        scene: new THREE.Scene(),
        renderer: initialize()
    };

    new COMP.System.IO({
        name: 'Renderer',
        isStatic: true,
        
        dependencies: [],

        component: function () {
            return component;
        },

        process: function (staticEntity) {
            var Renderer = staticEntity.Renderer;

            Renderer.renderer.render(Renderer.scene, Renderer.camera);

            // var cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
            // cam.position.z = 1000;

            // Renderer.renderer.render(Renderer.scene, cam);
        }
    });
})();