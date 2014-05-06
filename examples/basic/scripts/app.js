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

camera.Object.position.z = 250;
camera.Hierarchy = cameraContainer;

new COMP.Entity({
    name: 'staticMesh',
    components: ['Mesh'], // components composing this entity
});

COMP();