new COMP.Entity({
    name: 'player',
    components: ['PlayerControl', 'Camera', 'CameraOffset', 'Mesh'], // components composing this entity
});

new COMP.Entity({
    name: 'staticMesh',
    components: ['Mesh'], // components composing this entity
});

COMP();