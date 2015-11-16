'use strict';

//
// ----------------------------------------
(function () {
    new CONV.System.Logic({
        name: 'PhysicsClearVelocity',

        dependencies: ['Physics'],

        requiredDependencies: ['Physics'],

        process: function(entities) {
            _.each(entities, function(e) {
                e.Physics.velocity = new CANNON.Vec3();
            });
        }
    });
})();
