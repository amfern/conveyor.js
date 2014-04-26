new COMP.Entity({
    name: 'player',

    // components composing this entity
    components: [
        'PlayerControl',
        'Rotate',
        'Translate',
        'Mesh'
    ],
});

new COMP.Entity({
    name: 'camera',

    // components composing this entity
    components: [
        // 'CameraControl',
        // 'Rotate',
        'Camera'
    ],
});

new COMP.Entity({
    name: 'staticMesh',
    components: ['Mesh'], // components composing this entity
});

COMP();