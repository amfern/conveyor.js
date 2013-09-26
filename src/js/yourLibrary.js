"use strict";
window.yourLibrary = (function() {
  var helloWorld, version;
  version = "0.0.1";
  helloWorld = function() {
    return console.error("Hello World JS!");
  };
  return {
    version: version,
    hello: helloWorld
  };
})();
