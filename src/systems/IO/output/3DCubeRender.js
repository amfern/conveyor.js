// Wraps THREE.js as graphic output
// -----------------------------------------
(function() {
  var camera, scene, renderer;
  var material, mesh, geometry;

  function init() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    scene = new THREE.Scene();

    geometry = new THREE.CubeGeometry( 200, 200, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;

    document.addEventListener("DOMContentLoaded", function(event) {
      document.body.appendChild( renderer.domElement );
    });
  }

  init();

  new COMP.System.IO({
    name: '3DCubeRender',
    dependencies: ['3DObjectAfter'],

    component: function() {
      return {};
    }, 

    process: function(entities) {
      _.each(entities, function(e) {
        var object3D = e['3DObjectAfter'];
        
        mesh.position    = object3D.position;
        mesh.rotation    = object3D.rotation;
        mesh.scale       = object3D.scale;
        mesh.quaternion  = object3D.quaternion;

        renderer.render( scene, camera );
      });
    }
  });
})();

