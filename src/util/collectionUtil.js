_.mixin({ 
  clearLocal: function(obj) {
     for (var prop in obj) {
        if(obj.hasOwnProperty(prop)){
          delete obj[prop];
        }
     }
    return obj;
  },
  clearAll: function(obj) {
     for (var prop in obj) {
        delete obj[prop];
     }
    return obj;
  },
  combine: function(source) {
    arguments.splice(0,1);

    _.each(arguments, function(targetArray) {
      spliceArgs = [source.length, targetArray.length].concat(targetArray);
      source.splice.apply(source, spliceArgs);
    });

    return source;
  },
  prefixKeys: function(obj, prefix) {
    var buffer = {};
    _.each(obj, function(v,k) { buffer[prefix+k] = v; });
    return buffer;
  }

});