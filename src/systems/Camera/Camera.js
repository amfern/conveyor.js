'use strict';

// 3D position system
// -----------------------------------------
new CONV.System.Interpolate({
    name: 'Camera',

    dependencies: ['Interpolate', 'HierarchyInterpolate'],

    requiredDependencies: ['RendererCamera', 'TransformMatrix'],

    process: function (entities) {
        var entity = _.first(entities);

        if (!entity) {
            return;
        }

        var RendererCamera = entity.RendererCamera;

        RendererCamera.copy(entity.TransformMatrix);
    }
});
