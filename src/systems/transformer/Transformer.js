'use strict';

// 3D transformation, normalized between zero to one
// -----------------------------------------
new CONV.System.Logic({
    name: 'Transformer',

    dependencies: [],

    process: function (entities) {
        _.each(entities, function (e) {
            e.Transformer = {
                translation: new THREE.Vector3(),
                // using vector because quaternions slerped into wrong
                // directions if rotated more then PI
                rotation: new THREE.Vector3(),
                scaling: new THREE.Vector3()
            };
        });
    }
});
