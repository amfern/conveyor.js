'use strict';

// reset engine
afterEach(function () {
    expect(CONV.systemCallbacksToBeExecuted.length).toEqual(0); // should execute every engine cycle
    CONV.systemCallbacksToBeExecuted.length = 0;
});

// mock system types to be deleted after each test
(function () {
    CONV.systemCallbacksToBeExecuted = [];

    function executeCallback(specCallback) {
        specCallback.call();
        CONV.systemCallbacksToBeExecuted.splice(CONV.systemCallbacksToBeExecuted.indexOf(specCallback), 1);
    }

    function cycle(specCallback, cycleTime) {
        specCallback = specCallback || function () {};
        CONV.systemCallbacksToBeExecuted.push(specCallback);

        window.performance.now = function () { return 0; };
        window.requestAnimationFrame = _.once(function (callback) {
            window.performance.now = function () { return cycleTime; }; // milliseconds
            callback.call();
            executeCallback(specCallback);
        });
        CONV();
    }

    function cycleMany(cycleCallback, count, specCallback, index) {
        specCallback = specCallback || {};
        CONV.systemCallbacksToBeExecuted.push(specCallback);

        cycleCallback(function () {
            if (index === count - 1) {
                executeCallback(specCallback);
                return;
            }
            cycleMany(cycleCallback, count, specCallback, (index || 0) + 1);
            CONV.systemCallbacksToBeExecuted.splice(CONV.systemCallbacksToBeExecuted.indexOf(specCallback), 1);
        });
    }

    // cycle once
    CONV.cycleOnce = function (specCallback) {
        cycle(specCallback, CONV.SKIP_TICKS - 1);
    };

    // cycle half
    CONV.cycleHalf = function (specCallback) {
        cycle(specCallback, CONV.SKIP_TICKS / 2 - 1);
    };

    // spiral engine cycle is when engine avoiding spiral of death doing the maximum allowed cycles
    CONV.spiralCycle = function (specCallback) {
        cycle(specCallback, CONV.SKIP_TICKS * CONV.MAX_FRAMESKIP + 1);
    };

    // cycleMany
    CONV.cycleMany = function (count, specCallback) {
        cycleMany(CONV.cycleOnce, count, specCallback);
    };

    // spiralMany
    CONV.spiralCycleMany = function (count, specCallback) {
        cycleMany(CONV.spiralCycle, count, specCallback);
    };

    // callbacks to before executes before cycle continues 
    CONV.beforeCycleContinues = function (specCallbacks) {
        CONV.systemCallbacksToBeExecuted = specCallbacks.concat(CONV.systemCallbacksToBeExecuted);
    };

    CONV.afterCycleContinues = function (specCallbacks) {
        CONV.systemCallbacksToBeExecuted = CONV.systemCallbacksToBeExecuted.concat(specCallbacks);
    };

    // array of specCallbacks each callback representing engine cycle
    // continues cycle starts engine only once and cycles from there
    CONV.cycleContinues = function (specCallbacks) {
        var animationFrameCallback;

        _.combine(CONV.systemCallbacksToBeExecuted, specCallbacks);

        window.performance.now = function () { return 0; };

        window.requestAnimationFrame = _.once(function (callback) {
            animationFrameCallback = callback;
        });
        CONV();

        _.each(CONV.systemCallbacksToBeExecuted.slice(), function (specCallback, i) {
            window.performance.now = function () { return CONV.SKIP_TICKS * (i + 1); }; // milliseconds
            animationFrameCallback();
            executeCallback(specCallback);
        });
    };
})();