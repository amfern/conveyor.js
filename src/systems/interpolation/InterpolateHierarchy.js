'use strict';

// Calcualtes world matrix
// TODO: when caluclating matrices create a buffer to check if somethink was already calcualted
// -----------------------------------------
(function () {
    function calculateMatrixWorld(entity) {
        var Transform = entity.TransformInterpolation,
            parent = entity.Hierarchy;

        Transform.updateMatrix();

        if (parent) {
            return new THREE.Matrix4().multiplyMatrices(calculateMatrixWorld(parent), Transform.matrix);
        }

        return Transform.matrix;
    }

    new CONV.System.Interpolate({
        name: 'InterpolateHierarchy',

        dependencies: ['TransformInterpolation', 'Interpolate', 'TransformWorldInterpolation'],
        
        requiredDependencies: ['TransformInterpolation', 'TransformWorldInterpolation', 'Interpolate'],

        // parent entity
        component: function () {
            return null;
        },

        process: function (entities) {
            _.each(entities, function (e) {
                var TransformWorldInterpolation = e.TransformWorldInterpolation = new THREE.Object3D();
                TransformWorldInterpolation.applyMatrix(calculateMatrixWorld(e));
            });
        }
    });
})();