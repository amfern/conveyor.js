'use strict';

// Updates transformation according to physics
// Note: Physics works only on root parent
// ----------------------------------------
(function () {
    new CONV.System.Logic({
        name: 'Physics',

        dependencies: ['Velocity', 'AngularVelocity', 'TransformPristine'],

        requiredDependencies: ['Transformer', 'Transform', 'PhysicsWorld'],

        component: function (props) {
            // TODO: merge default properties with given
            props = props || {
                mass: 5, // kg
                shape: new CANNON.Box(new CANNON.Vec3(100, 100, 100)) // m
            };

            return new CANNON.Body(props);
        },

        process: function (entities) {
            if (_.isEmpty(entities)) {
                return;
            }

            var world = new CANNON.World(),
                entity = _.first(entities);

            if (!entity) {
                return;
            }

            var PhysicsWorld = entity.PhysicsWorld;
            _.each(PhysicsWorld.contactMaterials, function (cm) {
                world.addContactMaterial(cm);
            });

            // extend world with properties
            _.extend(world, entity.PhysicsWorld);

            _.each(entities, function (e) {
                var Physics = e.Physics,
                    Transformer = e.Transformer,
                    Transform = e.Transform;

                Physics.position.copy(Transform.position);
                Physics.quaternion.copy({
                    w: Transform.rotate._w,
                    x: Transform.rotate._x,
                    y: Transform.rotate._y,
                    z: Transform.rotate._z
                });

                if (Transformer.translation.lengthSq()) {
                    Physics.velocity.copy(Transformer.translation);
                }

                if (Transformer.rotation.lengthSq()) {
                    Physics.angularVelocity.copy(Transformer.rotation);
                }

                world.addBody(Physics);
            });

            _(6).times(function(){ world.step(1/6); });

            _.each(entities, function (e) {
                var Physics = e.Physics,
                    Transform = e.Transform;

                Transform.rotate.copy({
                    _w: Physics.quaternion.w,
                    _x: Physics.quaternion.x,
                    _y: Physics.quaternion.y,
                    _z: Physics.quaternion.z
                });
                Transform.position.copy(Physics.position);
            });
        }
    });
})();
