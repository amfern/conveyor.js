'use strict';

// 3D position system relative to its parent
// -----------------------------------------
new COMP.System.Logic({
    name: 'Transform',

    dependencies: ['TransformWorldPristine'],

    requiredDependencies: ['TransformWorld'],

    component: function () {
        return new THREE.Object3D();
    },

    process: function () { }
});