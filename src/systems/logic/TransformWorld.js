'use strict';

// 3D position system
// -----------------------------------------
new COMP.System.Logic({
    name: 'TransformWorld',

    component: function () {
        return new THREE.Object3D();
    },

    process: function () { }
});