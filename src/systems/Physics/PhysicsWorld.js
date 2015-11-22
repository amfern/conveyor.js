'use strict';

// Configuration for Physics system
// contains collection of properties, look at link bellow for list of properties.
// http://schteppe.github.io/cannon.js/docs/classes/World.html#properites
// ----------------------------------------
(function () {
    var component = {};

    new CONV.System.Logic({
        name: 'PhysicsWorld',

        dependencies: [],

        isStatic: true,

        requiredDependencies: [],

        component: function (props) {
            props = props || {};
            _.extend(component, props);
            return component;
        }
    });
})();
