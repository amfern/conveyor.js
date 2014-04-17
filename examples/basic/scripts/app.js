'use strict';

var player = new COMP.Entity({
    name: 'player',

    // components composing this entity
    components: [
        'PlayerControl',
        'Rotate',
        'Translate',
        'Mesh'
    ],
});

var cameraContainer = new COMP.Entity({
    name: 'cameraContainer',

    // components composing this entity
    components: [
        'CameraControl',
        'Rotate',
    ],
});

cameraContainer.Hierarchy = player;

var camera = new COMP.Entity({
    name: 'camera',

    // components composing this entity
    components: [
        'Camera'
    ],
});

camera.Object.position.z = 500;
camera.Hierarchy = cameraContainer;

var staticMesh = new COMP.Entity({
    name: 'staticMesh',
    components: ['Mesh'], // components composing this entity
});

var geometry = new THREE.PlaneGeometry( 2000, 2000 );
var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });

staticMesh.Mesh = new THREE.Mesh(geometry, material);

COMP();