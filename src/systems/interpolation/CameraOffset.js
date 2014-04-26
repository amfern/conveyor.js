// 'use strict';

// // 3D position system
// // -----------------------------------------
// new COMP.System.IO({
//     name: 'CameraOffset',

//     dependencies: ['Camera'],

//     requiredDependencies: ['Renderer'],

//     component: function () {
//         return {
//             position: new THREE.Vector3(0, 0, 500),
//             rotation: null, // new THREE.Vector3(),
//             quaternion: null // new THREE.Quaternion()
//         };
//     },

//     process: function (entities) {
//         _.each(entities, function (e) {
//             var camera = e.Renderer.camera,
//                 cameraOffset = e.CameraOffset;   
//             if (cameraOffset.rotation) {
//                 // camera.rotate(cameraOffset.quaternion);
//             }

//             if (cameraOffset.quaternion) {
//                 // camera.applyQuaternion(cameraOffset.quaternion);
//             }

//             camera.translateX(cameraOffset.position.x);
//             camera.translateY(cameraOffset.position.y);
//             camera.translateZ(cameraOffset.position.z);
//         });
//     }
// });