'use strict';

// Calcualtes world matrix
// TODO: when caluclating matrices create a buffer to check if somethink was already calcualted
// -----------------------------------------
(function () {
    function calculateMatrixWorld(entity) {
        var object = entity.Object,
            parent = entity.Hierarchy;

        object.updateMatrix();

        if (parent) {
            return new THREE.Matrix4().multiplyMatrices(calculateMatrixWorld(parent), object.matrix);
        }

        return object.matrix;
    }

    new COMP.System.Logic({
        name: 'Hierarchy',

        dependencies: ['Translate'],
        
        requiredDependencies: ['Object'],

        // parent entity
        component: function () {
            return null;
        },

        process: function (entities) {
            _.each(entities, function (e) {
                e.Object.matrixWorld = calculateMatrixWorld(e);
            });
        }
    });
})();