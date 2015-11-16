'use strict';

/* player
-------------------------------------------------------------------------- */
var player = new CONV.Entity({
    name: 'player',

    // components composing this entity
    components: {
        'Transform': {
            position: new THREE.Vector3(0, 100, 0)
        },
        'ActiveKeyBinds': [
            'yawRight',
            'yawLeft',
            'moveForward',
            'moveBack',
            'moveLeft',
            'moveRight',
            'moveUp',
            'moveDown'
        ],
        'HIDRotate': null,
        'HIDTranslate': null,
        'Velocity': null,
        'AngularVelocity': null,
        'Mesh': null,
        'Interpolate': null,
        'HierarchyInterpolate': null,
        'Physics': null,
        'PhysicsClearAngularVelocity': null,
        'BallEmitter': null
    },
});


/* camera
-------------------------------------------------------------------------- */
var cameraContainer = new CONV.Entity({
    name: 'cameraContainer',

    // components composing this entity
    components: {
        'ActiveKeyBinds': ['pitchUp', 'pitchDown'],
        'HIDRotate': null,
        'AngularVelocity': null,
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
            position: new THREE.Vector3(0, 0, 500)
        },
        'Parent': cameraContainer,
        'Interpolate': null,
        'HierarchyInterpolate': null,
        'Camera': null
    },
});


/* ground
-------------------------------------------------------------------------- */
new CONV.Entity({
    name: 'ground',
    components: {
        'Transform': {
            rotate: new THREE.Quaternion()
                .setFromAxisAngle(new THREE.Vector3(1,0,0), -Math.PI/2),
        },
        'Mesh': {
            geometry: new THREE.PlaneGeometry( 20000, 20000 ),
            material: new THREE.MeshBasicMaterial()
        },
        'Physics': {
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(10000, 10000, 1))
        }
    },

});

/* boxes */
_(10).times(function(i){
    new CONV.Entity({
        name: 'box' + i,
        components: {
            'Transform': {
                position: new THREE.Vector3(
                    Math.random() * 1000 - 500,
                    100,
                    Math.random() * 1000 - 500
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

// ball emitter when attacking
// ----------------------------------------
(function () {
    var mBallCount = 0,
        mGeometry = new THREE.SphereGeometry(100),
        mMaterial = new THREE.MeshBasicMaterial();


    function newBallEntity(initialPosition, initialVelocity) {
        new CONV.Entity({
            name: 'ball' + mBallCount++,
            components: {
                'Transform': {
                    position: initialPosition
                },
                'Physics': {
                    mass: 1, // kg
                    shape: new CANNON.Sphere(100), // m
                    velocity: initialVelocity
                },
                'Mesh': {
                    geometry: mGeometry,
                    material: mMaterial
                },
                'Interpolate': null
            }
        });
    }
    new CONV.System.Logic({
        name: 'BallEmitter',

        dependencies: ['Hierarchy', 'Physics'],

        requiredDependencies: ['TransformMatrix', 'HIDComboState'],

        component: function (props) {
            return {
                velocity: 10
            };
        },

        process: function (entities) {
            _.each(entities, function(e) {
                var TransformMatrix = e.TransformMatrix,
                    HIDComboState = e.HIDComboState,
                    ActiveKeyBinds = e.ActiveKeyBinds,
                    BallEmitter = e.BallEmitter,
                    triggered = {},
                    position = new THREE.Vector3(),
                    quaternion = new THREE.Quaternion(),
                    scale = new THREE.Vector3();

                _.each(ActiveKeyBinds, function (keyBindName) {
                    triggered[keyBindName] = !!~HIDComboState.indexOf(keyBindName);
                });

                TransformMatrix.decompose(position, quaternion, scale);

                if (triggered.attack) {
                    // shoot to the front of the object
                    newBallEntity(position, new THREE.Vector3(0,0,-100).applyQuaternion(quaternion));
                }
            });
        }
    });
})();

/* start engine
-------------------------------------------------------------------------- */
CONV();


// TODO: gravity
// TODO: lighting and shadows
