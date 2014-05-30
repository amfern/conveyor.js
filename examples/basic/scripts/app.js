'use strict';

/* player
-------------------------------------------------------------------------- */
var player = new COMP.Entity({
    name: 'player',

    // components composing this entity
    components: [
        'PlayerControl',
        'HIDRotate',
        'HIDTranslate',
        'Rotate',
        'Translate',
        'Hierarchy',
        'Interpolate',
        'Mesh'
    ],
});


/* camera
-------------------------------------------------------------------------- */
var cameraContainer = new COMP.Entity({
    name: 'cameraContainer',

    // components composing this entity
    components: [
        'CameraControl',
        'HIDRotate',
        'Rotate',
        'Hierarchy',
        'Interpolate'
    ],
});

cameraContainer.Hierarchy = player;

var camera = new COMP.Entity({
    name: 'camera',

    // components composing this entity
    components: [
        'Hierarchy',
        'Interpolate',
        'Camera'
    ],
});

camera.Transform.position.z = 500;
camera.Hierarchy = cameraContainer;


/* static mesh
-------------------------------------------------------------------------- */
var staticMesh = new COMP.Entity({
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
COMP();