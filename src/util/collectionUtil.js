'use strict';

_.mixin({
    clearLocal: function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                delete obj[prop];
            }
        }
        return obj;
    },
    clearAll: function (obj) {
        for (var prop in obj) {
            delete obj[prop];
        }
        return obj;
    },
    combine: function (source) {
        var args = Array.prototype.slice.call(arguments, 1, arguments.length);

        _.each(args, function (targetArray) {
            var spliceArgs = [source.length, targetArray.length].concat(targetArray);
            source.splice.apply(source, spliceArgs);
        });

        return source;
    },
    prefixKeys: function (obj, prefix) {
        var buffer = {};
        _.each(obj, function (v, k) {
            buffer[prefix + k] = v;
        });
        return buffer;
    },

    findKey: function (obj, value) {
        var key;

        _.find(obj, function (v, k) {
            if (v === value) {
                key = k;
                return true;
            }

            return false;
        });

        return key;
    }

});
