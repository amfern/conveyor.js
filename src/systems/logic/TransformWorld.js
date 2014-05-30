'use strict';

// 3D world position system relative to the world
// -----------------------------------------
new COMP.System.Logic({
    name: 'TransformWorld',

    component: function () {
        return new THREE.Object3D();
    },

    process: function () { }
});