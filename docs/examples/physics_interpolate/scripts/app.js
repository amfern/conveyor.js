'use strict';

/* player
-------------------------------------------------------------------------- */
var player = new CONV.Entity({
    name: 'player',

    // components composing this entity
    components: {
        'Transform': {
            position: new THREE.Vector3(0, 0, 200)
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
        'Physics': null
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


/* static mesh
-------------------------------------------------------------------------- */
var staticMesh = new CONV.Entity({
    name: 'staticMesh',
    components: {
        'Mesh': null,
        'Physics': {
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(1000, 1000, 1))
        }
    },

});

var geometry = new THREE.PlaneGeometry( 2000, 2000 );
var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });

staticMesh.Mesh = new THREE.Mesh(geometry, material);


/* start engine
-------------------------------------------------------------------------- */
CONV();
