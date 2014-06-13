'use strict';

// Calcualtes world matrix
// TODO: when caluclating matrices create a buffer to check if somethink was already calcualted
// -----------------------------------------
(function () {
    function calculateMatrixWorld(entity) {
        var Transform = entity.Transform,
            parent = entity.Hierarchy;

        Transform.updateMatrix();

        if (parent) {
            return new THREE.Matrix4().multiplyMatrices(calculateMatrixWorld(parent), Transform.matrix);
        }

        return Transform.matrix;
    }

    new COMP.System.Logic({
        name: 'Hierarchy',

        dependencies: ['Transform', 'Rotate', 'Translate'],
        
        requiredDependencies: ['Transform', 'TransformWorld'],

        // parent entity
        component: function () {
            return null;
        },

        process: function (entities) {
            _.each(entities, function (e) {
                var TransformWorld = e.TransformWorld = new THREE.Object3D();
                TransformWorld.applyMatrix(calculateMatrixWorld(e));
            });
        }
    });
})();