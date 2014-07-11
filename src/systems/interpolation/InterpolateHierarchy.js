'use strict';

// Calcualtes world matrix
// TODO: when caluclating matrices create a buffer to check if somethink was already calcualted
// -----------------------------------------
(function () {
    function calculateMatrixWorld(entity) {
        var Transform = entity.TransformInterpolation,
            Parent = entity.Parent;

        Transform.updateMatrix();

        if (Parent) {
            return new THREE.Matrix4().multiplyMatrices(calculateMatrixWorld(Parent), Transform.matrix);
        }

        return Transform.matrix;
    }

    new CONV.System.Interpolate({
        name: 'InterpolateHierarchy',

        dependencies: [],
        
        requiredDependencies: ['TransformWorldInterpolation', 'Interpolate', 'Parent'],

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