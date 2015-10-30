'use strict';

// 3D position system relative to its parent
// -----------------------------------------
new CONV.System.Logic({
    name: 'Transform',

    dependencies: ['TransformWorldPristine'],

    requiredDependencies: ['TransformWorld'],

    component: function (transform) {
        transform = transform || {};
        return {
            position: transform.position || new THREE.Vector3(),
            rotate: transform.rotate || new THREE.Quaternion(),
            scale: transform.scale || new THREE.Vector3(1,1,1)
        };
    }
});
