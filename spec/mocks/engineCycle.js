'use strict';

// reset engine
afterEach(function () {
    expect(COMP.systemCallbacksToBeExecuted.length).toEqual(0); // should execute every engine cycle
    COMP.systemCallbacksToBeExecuted.length = 0;
});

// mock system types to be deleted after each test
(function () {
    COMP.systemCallbacksToBeExecuted = [];

    function executeCallback(specCallback) {
        specCallback.call();
        COMP.systemCallbacksToBeExecuted.splice(COMP.systemCallbacksToBeExecuted.indexOf(specCallback), 1);
    }

    function cycle(specCallback, cycleTime) {
        specCallback = specCallback || function () {};
        COMP.systemCallbacksToBeExecuted.push(specCallback);

        window.performance.now = function () { return 0; };
        window.requestAnimationFrame = _.once(function (callback) {
            window.performance.now = function () { return cycleTime; }; // milliseconds
            callback.call();
            executeCallback(specCallback);
        });
        COMP();
    }

    function cycleMany(cycleCallback, count, specCallback, index) {
        specCallback = specCallback || {};
        COMP.systemCallbacksToBeExecuted.push(specCallback);

        cycleCallback(function () {
            if (index === count - 1) {
                executeCallback(specCallback);
                return;
            }
            cycleMany(cycleCallback, count, specCallback, (index || 0) + 1);
            COMP.systemCallbacksToBeExecuted.splice(COMP.systemCallbacksToBeExecuted.indexOf(specCallback), 1);
        });
    }

    // cycle once
    COMP.cycleOnce = function (specCallback) {
        cycle(specCallback, COMP.SKIP_TICKS - 1);
    };

    // cycle half
    COMP.cycleHalf = function (specCallback) {
        cycle(specCallback, COMP.SKIP_TICKS / 2 - 1);
    };

    // spiral engine cycle is when engine avoiding spiral of death doing the maximum allowed cycles
    COMP.spiralCycle = function (specCallback) {
        cycle(specCallback, COMP.SKIP_TICKS * COMP.MAX_FRAMESKIP + 1);
    };

    // cycleMany
    COMP.cycleMany = function (count, specCallback) {
        cycleMany(COMP.cycleOnce, count, specCallback);
    };

    // spiralMany
    COMP.spiralCycleMany = function (count, specCallback) {
        cycleMany(COMP.spiralCycle, count, specCallback);
    };

    // callbacks to before executes before cycle continues 
    COMP.beforeCycleContinues = function (specCallbacks) {
        COMP.systemCallbacksToBeExecuted = specCallbacks.concat(COMP.systemCallbacksToBeExecuted);
    };

    COMP.afterCycleContinues = function (specCallbacks) {
        COMP.systemCallbacksToBeExecuted = COMP.systemCallbacksToBeExecuted.concat(specCallbacks);
    };

    // array of specCallbacks each callback representing engine cycle
    // continues cycle starts engine only once and cycles from there
    COMP.cycleContinues = function (specCallbacks) {
        var animationFrameCallback;

        _.combine(COMP.systemCallbacksToBeExecuted, specCallbacks);

        window.performance.now = function () { return 0; };

        window.requestAnimationFrame = _.once(function (callback) {
            animationFrameCallback = callback;
        });
        COMP();

        _.each(COMP.systemCallbacksToBeExecuted.slice(), function (specCallback, i) {
            window.performance.now = function () { return COMP.SKIP_TICKS * (i + 1); }; // milliseconds
            animationFrameCallback();
            executeCallback(specCallback);
        });
    };
})();