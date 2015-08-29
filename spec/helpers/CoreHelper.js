/* exported tapIntoSystem */
'use strict';

// reset engine
afterEach(function () {
    // set timer to 0
    window.performance.now = function () {
        return 0;
    };

    // remove all systems created during test
    _.each(CONV.Entity.mockedEntities, function (mEnt) {
        mEnt.originalRemove();
    });
    _.each(CONV.System.mockedSystems, function (mSys) {
        mSys.originalRemove();
    });
    CONV.Entity.mockedEntities = [];
    CONV.System.mockedSystems = [];
});

function tapIntoSystem(systemName, callback) {
    // add reading system
    new CONV.System.IO({
        name: 'EpicSystemReading' + systemName,
        requiredDependencies: [systemName],
        component: function () {},
        process: function (entities) {
            callback(entities[0][systemName]);
        }
    });
    new CONV.Entity({
        name: 'EpicSystemReading' + systemName + 'Entity',
        components: ['EpicSystemReading' + systemName]
    });
}
