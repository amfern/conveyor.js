'use strict';

// 3D position system relative to its parent
// -----------------------------------------
new CONV.System.Logic({
    name: 'Transform',

    dependencies: ['TransformWorldPristine'],

    requiredDependencies: ['TransformWorld'],

    component: function (defaults) {
        var component = new THREE.Object3D();

        // sanitize input
        defaults = defaults || {};

        defaults = {
            x: defaults.x || 0,
            y: defaults.y || 0,
            z: defaults.z || 0
        };

        // set initial position
        component.position.x = defaults.x;
        component.position.y = defaults.y;
        component.position.z = defaults.z;

        return component;
    }
});