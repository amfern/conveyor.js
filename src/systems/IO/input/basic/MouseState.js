// Collects Mouse inputs state, analog states will be passed as {mouseMoved: true, mouseMovedUp: true, mouseMoveY: -0.73}
// -----------------------------------------
// (function() {
//   var component = { mousedowns: [], mouseups: [], mousemove: [] },
//       mousedowns, mouseups, mousemove;

//   function init() {
//     var element = COMP.getDOMElement();

//     element.addEventListener('mousedown', function(e) {
//       mousedowns.push(e);
//     }, false);
//     element.addEventListener('mouseup', function(e) {
//       mouseups.push(e);
//     }, false);
//     element.addEventListener('mousemove', function(e) {
//       mousemove.push(e);
//     }, false);
//   };

//   function reset() {
//     mousedowns.length = 0;
//     mouseups.length = 0;
//     mousemove.length = 0;
//   };

//   function copy() {
//     component.mousedowns = mousedowns;
//     component.mouseups = mouseups;
//     component.mousemove = mousemove;
//   }

//   init();
//   new COMP.System.IO({
//     name: 'MouseState',
//     dependencies: [],

//     component: function() {
//       return component;
//     },

//     proccess: function(entities) {
//       copy();
//       reset();
//     }
//   });
// })();
