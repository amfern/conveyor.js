'use strict';

// ball emitter when attacking
// ----------------------------------------
(function () {
    var mBallCount = 0,
        mGeometry = new THREE.SphereGeometry(0.2, 32, 32),
        mMaterial = new THREE.MeshBasicMaterial({color: 'red'});


    function newBallEntity(initialPosition, initialVelocity) {
        return {
            name: 'ball' + mBallCount++,
            components: {
                'Transform': {
                    position: initialPosition
                },
                'Physics': {
                    mass: 1, // kg
                    shape: new CANNON.Sphere(0.2), // m
                    velocity: initialVelocity
                },
                'Mesh': {
                    geometry: mGeometry,
                    material: mMaterial
                },
                'Interpolate': null
            }
        };
    }
    new CONV.System.Logic({
        name: 'BallEmitter',

        dependencies: ['Hierarchy', 'Physics'],

        requiredDependencies: ['TransformMatrix', 'HIDComboState', "BallsCreator"],

        component: function (props) {
            return {
                velocity: 15
            };
        },

        process: function (entities) {
            var entity = _.first(entities);

            if (!entity) {
                return;
            }

            var BallsCreator = entity.BallsCreator;

            _.each(entities, function(e) {
                var TransformMatrix = e.TransformMatrix,
                    HIDComboState = e.HIDComboState,
                    ActiveKeyBinds = e.ActiveKeyBinds,
                    BallEmitter = e.BallEmitter,
                    triggered = {},
                    position = new THREE.Vector3(),
                    quaternion = new THREE.Quaternion(),
                    scale = new THREE.Vector3(),
                    initialVelocity;

                _.each(ActiveKeyBinds, function (keyBindName) {
                    triggered[keyBindName] = !!~HIDComboState.indexOf(keyBindName);
                });

                if (!triggered.attack) {
                    return;
                }

                TransformMatrix.decompose(position, quaternion, scale);
                // shoot to the front of the object
                initialVelocity = new THREE.Vector3(0,0, -15).applyQuaternion(quaternion);
                BallsCreator.push(newBallEntity(position, initialVelocity));
            });
        }
    });
})();

// system which actually creates the balls entity
// ----------------------------------------
(function () {
    var mBalls = [];

    new CONV.System.Logic({
        name: 'BallsCreator',

        // static because entities should be added before or after engine
        // cycle never in the middle
        isStatic: true,

        component: function (props) {
            return mBalls;
        },

        process: function (entities) {
            _.each(mBalls, function(ball) {
                new CONV.Entity(ball);
            });

            // reset array to let
            mBalls.length = 0;
        }
    });
})();




/* ground
 -------------------------------------------------------------------------- */
var playerMaterial = new CANNON.Material("slipperyMaterial");
var groundMaterial = new CANNON.Material("groundMaterial");

var playerGroundContact = new CANNON.ContactMaterial(groundMaterial, playerMaterial, {
    friction: 0,
    restitution: 0.3,
    contactEquationStiffness: 1e8,
    contactEquationRelaxation: 3
});

var ground = new CONV.Entity({
    name: 'ground',
    components: {
        'Transform': {
            rotate: new THREE.Quaternion()
                .setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI/2)
        },
        'Mesh': {
            geometry: new THREE.PlaneGeometry( 300, 300, 50, 50 ),
            material: new THREE.MeshBasicMaterial()
        },
        'Physics': {
            mass: 0,
            shape: new CANNON.Plane(),
            material: groundMaterial
        },
        PhysicsWorld: {
            // quatNormalizeSkip: 0,
            // quatNormalizeFast: false,
            // defaultContactMaterial: newDefaultContactMaterial(),
            // contactMaterial: newContactMaterial(),
            // solver: newDefaultSolver(),
            gravity: new CANNON.Vec3(0,-20,0),
            // broadphase: new CANNON.NaiveBroadphase(),
            contactMaterials: [playerGroundContact]
        }
    },

});

/* player
 -------------------------------------------------------------------------- */
var player = new CONV.Entity({
    name: 'player',

    // components composing this entity
    components: {
        'Transform': {
            position: new THREE.Vector3(0, 5, 0)
        },
        'ActiveKeyBinds': [
            'yawRight',
            'yawLeft'
        ],
        'HIDRotate': null,
        'Hierarchy': null,
        'HIDTranslateHorizontal': null,
        'HIDJump': null,
        'HIDTranslateDepth': null,
        'Velocity': null,
        'AngularVelocity': 0.05,
        'Mesh': {
            geometry: new THREE.BoxGeometry(1, 1, 1)
        },
        'Interpolate': null,
        'HierarchyInterpolate': null,
        'Physics': {
            mass: 5, // kg
            shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)), // m
            // shape: new CANNON.Sphere(0.5),
            material: playerMaterial,
            linearDamping: 0.9
        },
        TransformerNeedContact: [ground.Physics],
        'PhysicsClearAngularVelocity': null
    }
});


/* camera
-------------------------------------------------------------------------- */
var cameraContainer = new CONV.Entity({
    name: 'cameraContainer',

    // components composing this entity
    components: {
        'ActiveKeyBinds': ['pitchUp', 'pitchDown'],
        'HIDRotate': null,
        'AngularVelocity':  0.005,
        'Rotate': null,
        'Parent': player,
        'Interpolate': null,
        'HierarchyInterpolate': null
    }
});

new CONV.Entity({
    name: 'camera',

    // components composing this entity
    components: {
        'Transform': {
            position: new THREE.Vector3(0, 0, 2)
        },
        'Parent': cameraContainer,
        'Interpolate': null,
        'HierarchyInterpolate': null,
        'Camera': null
    },
});


/* ball emitter
 -------------------------------------------------------------------------- */
var ballEmmiter = new CONV.Entity({
    name: 'ballEmmiter',

    // components composing this entity
    components: {
        'Transform': {
            position: new THREE.Vector3(0, 0, -0.6)
        },
        'ActiveKeyBinds': [
            'attack'
        ],
        'Hierarchy': null,
        'Parent': cameraContainer,
        'BallEmitter': null
    },
});


/* boxes */
_.times(10, function(i){
    new CONV.Entity({
        name: 'box' + i,
        components: {
            'Transform': {
                position: new THREE.Vector3(
                    (Math.random()-0.5)*20,
                    1 + (Math.random()-0.5)*1,
                    (Math.random()-0.5)*20
                ),
                rotate: new THREE.Quaternion()
                    .setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2 * Math.random())
            },
            'Physics': null,
            'Mesh': null,
            'Interpolate': null
        },
    });

});

/* start engine
 -------------------------------------------------------------------------- */
CONV();

// TODO: lighting and shadows - same principle as above
// TODO: jumping - create new system which runs after HIDTranslate and if jump key detected,
//       it sets Tranmsformer to higher value, so Velocity system will take care of the rest
//       break HIDTranslate to 3 different systems
// TODO: joint locks
// TODO: fix flipping, we can't fix it, what we can do is ignore it,
//       by calculating translation without z rotation.
//       and by changing camera to follow position only
// TODO: there is no need for activekeybinds system, all the movement systems have to be granular
// TODO: if there is a contact with ground, nullify transformer.translation
// TODO: in the middle of updating lodash, then we should update three
