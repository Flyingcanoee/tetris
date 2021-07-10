
let bottomOffset;
let allForms = [];
let playSpace = document.querySelector(".play-space");
let playSpaceRect = playSpace.getBoundingClientRect();

let playSpaceWidth = playSpaceRect.width;
let playSpaceHeight = playSpaceRect.height;
let leftOffset;
let declineIndex = 3;
let newBottomOffset;

const screenWidth = document.body.clientWidth;
const screenHeight = document.body.clientHeight;
let screenProportion = screenWidth / screenHeight;
let picProportion = 1.27;
let formsContainer = document.querySelector(".forms-container");
let doNotShift;
let id;
let createAllElementsIndex = 0;
let secondButton = document.querySelector(".second-button");
let repeater;
let button = document.querySelector(".button");
let firstButton = document.querySelector(".first-button");
let firstButtonIsPressed = firstButton.classList.contains("hidden");
let buttonContainer = document.querySelector(".button-container");
let rules = document.querySelector(".rules");
let firstTime;
let degree = 0;
const SHIFT_INTERVAL = 20;
const BACKGROUND_QUANTITY = 3
const ARROW_DOWN = 40;
const ARROW_LEFT = 37;
const ARROW_RIGHT = 39;
const SPACE = 32;


function createNextFigure() {
    let div = document.createElement('div');
    createAllElementsIndex++;
    div.id = 'form' + createAllElementsIndex;
    formId = div.id;
    let randomNumber = Math.floor(Math.random() * 10)
    if (randomNumber >= 0 && randomNumber < 4) {
        div.className = 'all-forms forms-0';
        div.style.backgroundImage = `url('./img/img0/image ${Math.floor(Math.random() * 8)}.jpg')`;
    }
    if (randomNumber >= 4 && randomNumber < 8) {
        div.className = 'all-forms forms-1';
        div.style.backgroundImage = `url('./img/img1/image ${Math.floor(Math.random() * 7)}.jpg')`;
    }
    if (randomNumber >= 8 && randomNumber < 10) {
        div.className = 'all-forms forms-2';
        div.style.backgroundImage = `url('./img/img2/image ${Math.floor(Math.random() * 2)}.jpg')`;
    }

    formsContainer.appendChild(div);
    return formId;
}

secondButton.onclick = function deleteAllForms() {
    allForms = [];
    formsContainer.innerHTML = "";
    secondButton.classList.add("hidden");
    id = createNextFigure();
    repeater = setInterval(declineFigure, 20);
    doNotShift = false;
    declineIndex = 3;
    buttonContainer.classList.remove("pale");
}

function startWithEnter(key) {
    let secondButtonIsPressed = secondButton.classList.contains("hidden");
    if (key.keyCode === 13 && !firstButtonIsPressed && firstTime) {
        firstTime = false;
        rules.classList.remove("hidden");
        button.classList.add("hidden");
        rules.classList.remove("rules-second");
        setTimeout(function () {
            let bg = document.querySelector(".background");
            let index = Math.floor(Math.random() * 3);
            bg.style.backgroundImage = `url('./img/bg\ ${index}.jpg')`;
            repeater = setInterval(declineFigure, 20);
            firstButtonIsPressed = true;
            rules.classList.add("hidden");
            declineIndex = 3;
        }, 4000)
    } else if (key.keyCode === 13 && !secondButtonIsPressed) {
        let bg = document.querySelector(".background");
        let index = Math.floor(Math.random() * 3);
        bg.style.backgroundImage = `url('./img/bg\ ${index}.jpg')`;
        allForms = [];
        formsContainer.innerHTML = "";
        secondButton.classList.add("hidden");
        id = createNextFigure();
        repeater = setInterval(declineFigure, 20);
        declineIndex = 3;
        secondButtonIsPressed = true;
        doNotShift = false;
        buttonContainer.classList.remove("pale");
    }
}

button.onclick = function () {
    let rules = document.querySelector(".rules");
    rules.classList.remove("hidden");
    firstTime = false;
    button.classList.add("hidden");
    setTimeout(function () {
        let bg = document.querySelector(".background");
        let index = Math.floor(Math.random() * BACKGROUND_QUANTITY);
        bg.style.backgroundImage = `url('./img/bg\ ${index}.jpg')`;
        repeater = setInterval(declineFigure, 20);
        rules.classList.add("hidden");
    }, 4000)
}

function onTheRoof() {
    let figure = document.getElementById(id);
    let rect = figure.getBoundingClientRect();

    allForms.push({
        top: rect.top,
        leftAngle: rect.left,
        rightAngle: rect.right,
        bottom: rect.bottom
    });

}

function declineFigure() {
    let figure = document.getElementById(id);
    let rect = figure.getBoundingClientRect();
    let playSpaceRect = playSpace.getBoundingClientRect();
    if (bottomOffset > 0) {
        let figureHasToStop = false;
        for (let value of allForms) {
            const horizontalCoordsMatch = !(
                ((rect.left <= value.leftAngle) && (rect.right <= value.leftAngle)) ||
                ((rect.left >= value.rightAngle) && (rect.right >= value.rightAngle))
            );
            const figureCrashedIntoAnotherFigure = (
                (value.top <= rect.bottom + 0.1) &&
                (value.top >= rect.bottom - declineIndex)
            );
            if (figureCrashedIntoAnotherFigure && horizontalCoordsMatch) {
                figureHasToStop = true;
                const difference = rect.bottom - value.top;
                bottomOffset += difference;
                figure.style.bottom = bottomOffset + "px";
            }
        }

        if (figure.classList.contains("forms-1") && rect.bottom > playSpaceRect.bottom) {
            figureHasToStop = true;
            let difference = rect.bottom - playSpaceRect.bottom;
            bottomOffset += difference;
            figure.style.bottom = bottomOffset + "px";
        }

        if (figureHasToStop) {
            let figureTop = rect.top;
            if (figureTop > playSpaceRect.top) {
                declineIndex = 3;
                onTheRoof();
                id = createNextFigure();
                bottomOffset = newBottomOffset;
                leftOffset = playSpaceWidth / 2;
            } else {
                secondButton.classList.remove("hidden");
                buttonContainer.classList.add("pale");
                doNotShift = true;
                clearInterval(repeater);
            }
        } else {
            bottomOffset -= declineIndex;
            figure.style.bottom = bottomOffset + "px";
        }
    } else {
        figure.style.bottom = 0;
        declineIndex = 3;
        onTheRoof();
        id = createNextFigure();
        bottomOffset = newBottomOffset;
        leftOffset = playSpaceWidth / 2;
    }
}

function shiftLeft() {
    let figure = document.getElementById(id);
    let rect = figure.getBoundingClientRect();
    for (value of allForms) {
        if (
            (rect.top < value.bottom) && (rect.bottom > value.top) &&
            (rect.left - SHIFT_INTERVAL <= value.rightAngle) && 
            (rect.left > value.rightAngle - SHIFT_INTERVAL) &&
            !(rect.right < value.leftAngle)
        ) {
            let diff = rect.left - value.rightAngle;
            figure.style.left = leftOffset - diff + "px";
            leftOffset -= diff;
            return;
        }
    }
    if ((leftOffset > 0)) {
        leftOffset -= SHIFT_INTERVAL;
        figure.style.left = leftOffset + "px";
    } else {
        figure.style.left = leftOffset + "px";
    }
}

function shiftRight() {
    let figure = document.getElementById(id);
    let rect = figure.getBoundingClientRect();
    let figureWidth = figure.getBoundingClientRect().width;
    for (value of allForms) {
        if (
            (rect.top < value.bottom) && (rect.bottom > value.top) &&
            ((rect.right + SHIFT_INTERVAL) >= value.leftAngle) && 
            ((rect.right) > value.leftAngle - SHIFT_INTERVAL) && !(rect.left >= value.rightAngle)
        ) {
            let diff = value.leftAngle - rect.right;
            figure.style.right = leftOffset + diff + "px";
            leftOffset += diff;
            return;
        }
    }
    if (leftOffset < playSpaceWidth - figureWidth) {
        leftOffset += SHIFT_INTERVAL;
        figure.style.left = leftOffset + "px";
    } else {
        figure.style.left = leftOffset;
    }
}

function shiftDown() {
    declineIndex = 10;
}

function rotate() {
    let figure = document.getElementById(id);
    degree += 90;
    figure.style.transform = `rotate( ${degree}deg)`;
}

function newBackground() {
    if (screenWidth > 768 && !isScreenInLandscapeMode()) {
        if (screenProportion > picProportion + 0.2) {
            playSpaceWidth = 0.42 * screenWidth;
            playSpaceHeight = 0.42 * screenWidth / 1.27;
            playSpace.style.width = playSpaceWidth + "px";
            playSpace.style.height = playSpaceHeight + "px";
            playSpace.style.left = `calc(50% - ${playSpaceWidth / 2}px)`;
            playSpace.style.top = `calc(50% - ${playSpaceHeight / 2}px)`;
        } else {
            playSpaceHeight = 0.52 * screenHeight;
            playSpaceWidth = 0.52 * screenHeight * 1.27;
            playSpace.style.width = playSpaceWidth + "px";
            playSpace.style.height = playSpaceHeight + "px";
            playSpace.style.left = `calc(50% - ${playSpaceWidth / 2}px)`;
            playSpace.style.top = `calc(50% - ${playSpaceHeight / 2}px)`;
        }
    }

    let formId = createNextFigure();
    let allFigures = document.getElementById(formId);
    let cssRules = getComputedStyle(allFigures);
    bottomOffset = parseInt(cssRules.bottom);
    id = formId;
    newBottomOffset = bottomOffset;
    doNotShift = false;
    leftOffset = playSpaceWidth / 2;
    firstTime = true;

    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function isScreenInLandscapeMode() {
    return (window.innerWidth < 900) && (window.innerHeight < window.innerWidth);
}

// на телефоне
function touch(coords) {
    if (doNotShift) {
        return;
    }

    let bottomPoint = playSpaceRect.bottom - 200;
    let leftPoint = playSpaceRect.left + 100;
    let rightPoint = playSpaceRect.right - 100;
    let centerPoint = playSpaceWidth / 2;
    let touchCords = coords.changedTouches[0].pageX;
    let verticalTouchCords = coords.changedTouches[0].pageY;

    if (touchCords < leftPoint) {
        shiftLeft();
    }
    if (touchCords > rightPoint) {
        shiftRight();
    }
    if (verticalTouchCords > bottomPoint) {
        shiftDown();
    }
    if (
        touchCords > centerPoint - 100 && 
        touchCords < centerPoint + 100 && 
        verticalTouchCords < bottomPoint
    ) {
        rotate()
    }
}

function moveFigure(key) {
    if (doNotShift) {
        return;
    }

    if (key.keyCode === ARROW_LEFT) {
        shiftLeft();
    }
    if (key.keyCode === ARROW_RIGHT) {
        shiftRight();
    }
    if (key.keyCode === ARROW_DOWN) {
        shiftDown();
    }
    if (key.keyCode === SPACE) {
        rotate();
    }
}

window.onload = newBackground;
document.body.addEventListener('keydown', moveFigure);
document.body.addEventListener('keydown', startWithEnter);
document.body.addEventListener('touchstart', touch);