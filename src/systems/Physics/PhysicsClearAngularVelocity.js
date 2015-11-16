'use strict';

//
// ----------------------------------------
(function () {
    new CONV.System.Logic({
        name: 'PhysicsClearAngularVelocity',

        requiredDependencies: ['Physics'],

        process: function(entities) {
            _.each(entities, function(e) {
                e.Physics.angularVelocity = new CANNON.Vec3();
            });
        }
    });
})();
