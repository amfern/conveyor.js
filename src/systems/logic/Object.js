'use strict';

// 3D position system
// -----------------------------------------
new COMP.System.Logic({
    name: 'Object',

    dependencies: ['ObjectPristine'],

    requiredDependencies: ['Hierarchy'],

    component: function () {
        return new THREE.Object3D();
    },

    process: function () { }
});