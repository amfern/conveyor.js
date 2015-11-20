/* exported mouseMoveEvent, mouseClickEvent, keydownEvent, keyupEvent, wheelEvent, resetMouseState */
'use strict';

function createGenericEvent() {
    return document.createEventObject ?
        document.createEventObject() : document.createEvent('Events');
}

function dispatchGenericEvent(eventName, eventObj) {
    if (window.document.dispatchEvent) {
        window.document.dispatchEvent(eventObj);
    } else {
        window.document.fireEvent(eventName, eventObj);
    }
}

function mouseEvent(type, screenX, screenY, clientX, clientY, button, clickCount, movementX, movementY) {
    var evt = new MouseEvent(type, {
        movementX: movementX,
        movementY: movementY,
        cancelable: true,
        bubbles: true,
        screenX: screenX, // screenX
        screenY: screenY, // screenY
        clientX: clientX, // clientX
        clientY: clientY, // clientY
        ctrlKey: false, // ctrlKey
        altKey: false, // altKey
        shiftKey: false, // shiftKey
        metaKey: false, // metaKey
        button: button, // button (0:left,1:Middle,2:right)
        relatedTargetElement: null // relatedTargetElement
    });

    window.document.dispatchEvent(evt);
    return evt;
}

function wheelEvent(deltaX, deltaY) {
    var eventObj = createGenericEvent();

    if (eventObj.initEvent) {
        eventObj.initEvent('wheel', true, true);
    }

    eventObj.wheelDeltaX = deltaX;
    eventObj.wheelDeltaY = deltaY;

    dispatchGenericEvent('wheel', eventObj);

    return eventObj;
}

function mouseMoveEvent(screenX, screenY, movementX, movementY) {
    return mouseEvent('mousemove', screenX, screenY, 0, 0, 0, 0, movementX, movementY);
}

function mouseClickEvent(button) {
    return mouseEvent('mousedown', 0, 0, 0, 0, button, 0, 0, 0);
}

function resetMouseState(state) {
    // reset mouse state
    _.clearAll(state);
    state.screenX = 0;
    state.screenY = 0;
    state.clientX = 0;
    state.clientY = 0;
    state.wheelX = 0;
    state.wheelY = 0;
    state.moved = { down: 0, up: 0 };
    state.movedUp = { down: 0, up: 0 };
    state.movedDown = { down: 0, up: 0 };
    state.movedLeft = { down: 0, up: 0 };
    state.movedRight = { down: 0, up: 0 };
    state.wheelMoved = { down: 0, up: 0 };
    state.wheelMovedUp = { down: 0, up: 0 };
    state.wheelMovedDown = { down: 0, up: 0 };
    state.wheelMovedLeft = { down: 0, up: 0 };
    state.wheelMovedRight = { down: 0, up: 0 };
}

function resetIOMouse(state) {
    // reset mouse state
    _.clearAll(state);
    state.screenX = 0;
    state.screenY = 0;
    state.clientX = 0;
    state.clientY = 0;
    state.wheelX = 0;
    state.wheelY = 0;
}

function keydownEvent(keyCode) {
    var eventObj = createGenericEvent();

    if (eventObj.initEvent) {
        eventObj.initEvent('keydown', true, true);
    }

    eventObj.keyCode = keyCode;
    eventObj.which = keyCode;

    dispatchGenericEvent('onkeydown', eventObj);

    return eventObj;
}

function keyupEvent(keyCode) {
    var eventObj = createGenericEvent();

    if (eventObj.initEvent) {
        eventObj.initEvent('keyup', true, true);
    }

    eventObj.keyCode = keyCode;
    eventObj.which = keyCode;

    dispatchGenericEvent('onkeyup', eventObj);

    return eventObj;
}
