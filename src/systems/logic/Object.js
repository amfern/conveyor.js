'use strict';

// 3D position system
// -----------------------------------------
new COMP.System.Logic({
    name: 'Object',

    component: function () {
        return new THREE.Object3D();
    },

    process: function () { }
});