'use strict';

// 3D transformation
// -----------------------------------------
new CONV.System.Logic({
    name: 'Transformer',

    dependencies: [],

    process: function (entities) {
        _.each(entities, function (e) {
            e.Transformer = {
                position: new THREE.Vector3(),
                rotation: new THREE.Vector3(),
                scale: new THREE.Vector3()
            };
        });
    }
});