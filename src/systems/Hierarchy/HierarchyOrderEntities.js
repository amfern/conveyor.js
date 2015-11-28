/*jshint bitwise: false*/
'use strict';

// orders entities in the linear hierarchical order
// -----------------------------------------
(function () {
    // returns arranged array of entities by their parent in-before them self
    function arrangeEntitiesByParent(entities) {
        var arrangedEntities = [];

        _.each(entities, function(e) {
            // add entities only if it doesn't exists
            if(!~arrangedEntities.indexOf(e)) {
                addEntitiesByParentOrder(arrangedEntities, e);
            }

        });

        return arrangedEntities;
    }

    // returns index of the entity inside of arrangedEntities
    function addEntitiesByParentOrder(arrangedEntities, entity) {
        if(!entity.Parent) {
            return arrangedEntities.unshift(entity);
        }

        var parentIndex = arrangedEntities.indexOf(entity.Parent);

        // if parent not added yet to arrangedEntities add it
        if(!~parentIndex) {
            parentIndex = addEntitiesByParentOrder(arrangedEntities, entity.Parent);
        }

        parentIndex++;

        // insert the entity after it's parent
        arrangedEntities.splice(parentIndex, 0, entity);

        return parentIndex;
    }

    new CONV.System.Logic({
        name: 'HierarchyOrderEntities',

        dependencies: [],

        requiredDependencies: ['Parent'],

        // parent entity
        component: function () {
            return [];
        },

        process: function (entities) {
            // do nothing if no entities
            if(!entities.length) {
                return;
            }

            var HierarchyOrderEntities = _.first(entities).HierarchyOrderEntities;
            HierarchyOrderEntities.length = 0;

            _.merge(HierarchyOrderEntities, arrangeEntitiesByParent(entities));
        }
    });
})();
