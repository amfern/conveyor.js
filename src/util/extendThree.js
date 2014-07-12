'use strict';

THREE.Object3D.prototype.copy = function (object) {
    this.up.copy( object.up );
    this.position.copy( object.position );
    this.quaternion.copy( object.quaternion );
    this.scale.copy( object.scale );
    this.matrix.copy( object.matrix );
};