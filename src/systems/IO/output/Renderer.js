'use strict';

// Renderer system
// -----------------------------------------
(function () {
    var component;

    function initializeRenderer() {
        var renderer = new THREE.WebGLRenderer();
            
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.autoClear = false;

        window.document.addEventListener('DOMContentLoaded', function () {
            renderer.domElement.id = 'RendererSystem';
            window.document.body.appendChild(renderer.domElement);
        });

        return renderer;
    }

    function initializeScene() {
        var scene = new THREE.Scene();
        scene.autoUpdate = true;
        
        return scene;
    }

    function initializeCamera() {
        return new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    }

    component = {
        renderer: initializeRenderer(),
        scene: initializeScene(),
        camera: initializeCamera()
    };

    new COMP.System.IO({
        name: 'Renderer',
        isStatic: true,
        
        dependencies: [],

        component: function () {
            return component;
        },

        process: function (staticEntity) {
            var Renderer = staticEntity.Renderer,
                RendererCamera = staticEntity.RendererCamera,
                RendererMeshes = staticEntity.RendererMeshes,
                renderer = Renderer.renderer,
                scene = Renderer.scene,
                camera = Renderer.camera;

            // update camera transform based on RendererCamera component
            camera.matrix = new THREE.Matrix4();
            camera.applyMatrix(RendererCamera.matrix);

            // add all meshes to the scene
            _.each(RendererMeshes, function (mesh) {
                scene.add(mesh);
            });

            renderer.render(scene, camera);
        }
    });
})();