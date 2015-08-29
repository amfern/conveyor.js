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
        'HIDRotate': null,
        'HIDTranslate': null,
        'Rotate': null,
        'Translate': null,
        'HierarchyInterpolate': null,
        'Mesh': null
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
        'Rotate': null,
        'Parent': player,
        'HierarchyInterpolate': null
    }
});

new CONV.Entity({
    name: 'camera',

    // components composing this entity
    components: {
        'Transform': {x: 0, y: 0, z: 500},
        'Parent': cameraContainer,
        'HierarchyInterpolate': null,
        'Camera': null
    },
});


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
