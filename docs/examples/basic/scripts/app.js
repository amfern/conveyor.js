'use strict';

/* player
-------------------------------------------------------------------------- */
var player = new CONV.Entity({
    name: 'player',

    // components composing this entity
    components: {
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
        'HIDRotate': undefined,
        'HIDTranslate': undefined,
        'Rotate': undefined,
        'Translate': undefined,
        'InterpolateHierarchy': undefined,
        'Mesh': undefined
    },
});


/* camera
-------------------------------------------------------------------------- */
var cameraContainer = new CONV.Entity({
    name: 'cameraContainer',

    // components composing this entity
    components: {
        'ActiveKeyBinds': ['pitchUp', 'pitchDown'],
        'HIDRotate': undefined,
        'Rotate': undefined,
        'InterpolateHierarchy': undefined
    }
});

cameraContainer.Hierarchy = player;

var camera = new CONV.Entity({
    name: 'camera',

    // components composing this entity
    components: [
        'InterpolateHierarchy',
        'Camera'
    ],
});

camera.Transform.position.z = 500;
camera.Hierarchy = cameraContainer;

/* static mesh
-------------------------------------------------------------------------- */
var staticMesh = new CONV.Entity({
    name: 'staticMesh',
    components: ['Mesh'], // components composing this entity
});

var geometry = new THREE.PlaneGeometry( 2000, 2000 );
var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });

staticMesh.Mesh = new THREE.Mesh(geometry, material);

staticMesh.TransformWorld.position.z = -1500;
staticMesh.TransformWorld.updateMatrix();


/* start engine
-------------------------------------------------------------------------- */
CONV();