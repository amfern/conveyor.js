'use strict';

// Calcualtes world matrix
// -----------------------------------------
new CONV.System.Interpolate({
    name: 'HierarchyInterpolate',

    dependencies: ['Interpolate'],

    requiredDependencies: ['TransformMatrix', 'HierarchyOrderEntities'],

    // parent entity
    component: function () {
        return null;
    },

    process: function (entities) {
        // do nothing if no entities
        if(!entities.length) {
            return;
        }

        entities = _.first(entities).HierarchyOrderEntities;

        _.each(entities, function (e) {
            if(e.Parent) {
                e.TransformMatrix.multiplyMatrices(
                    e.Parent.TransformMatrix,
                    e.TransformMatrix);
            }
        });
    }
});
