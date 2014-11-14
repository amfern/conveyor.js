'use strict';

// 3D world position system relative to the world
// -----------------------------------------
new CONV.System.Logic({
    name: 'TransformWorld',

    component: function () {
        return new THREE.Object3D();
    }
});