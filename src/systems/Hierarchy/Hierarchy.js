/*jshint bitwise: false*/
'use strict';

// Calcualtes world matrix
// -----------------------------------------
new CONV.System.Logic({
    name: 'Hierarchy',

    dependencies: [],

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

        // get entities ordered by hierarchy order system
        entities = _.first(entities).HierarchyOrderEntities;

        // calculate world matrices for all
        _.each(entities, function (e) {
            if(e.Parent) {
                e.TransformMatrix.multiplyMatrices(
                    e.Parent.TransformMatrix, e.TransformMatrix);
            }
        });
    }
});
