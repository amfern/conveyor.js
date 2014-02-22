/* exported tapIntoSystem */
'use strict';

// reset engine
afterEach(function () {
    // set timer to 0
    window.performance.now = function () {
        return 0;
    };

    // remove all systems created during test
    _.each(COMP.Entity.mockedEntities, function (mEnt) {
        mEnt.remove();
    });
    _.each(COMP.System.mockedSystems, function (mSys) {
        mSys.remove();
    });
    COMP.System.mockedEntities = [];
    COMP.System.mockedSystems = [];
});

function tapIntoSystem(systemName, callback) {
    // add reading system
    new COMP.System.IO({
        name: 'EpicSystemReading' + systemName,
        dependencies: [systemName],
        component: function () {},
        process: function (entities) {
            callback(entities[0][systemName]);
        }
    });
    new COMP.Entity({
        name: 'EpicSystemReading' + systemName + 'Entity',
        components: ['EpicSystemReading' + systemName]
    });
}