'use strict';

// Collection of whitelisted  keybinds
// -----------------------------------------
new CONV.System.Logic({
    name: 'Parent',

    dependencies: [],

    requiredDependencies: [],

    component: function (defaultParent) {
        return defaultParent || null;
    }
});
