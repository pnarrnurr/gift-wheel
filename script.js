// target the SVG and the pin right next to it
const containerSlices = document.querySelector('g#slices');
const pin = document.querySelector('svg#pin');

// immediately add simple dots around the wheel
for (let i = 0; i < 48; i += 1) {
    const transform = `rotate(${360 / 48 * i}), translate(0 -49.5), rotate(${-360 / 48 * i})`;
    const dot = `<circle r="0.5" cx="50" cy="50" fill="currentColor" transform="${transform}"/>`;
    containerSlices.innerHTML += dot;
}

// target the heading and the button
const heading = document.querySelector('h1');
const spinButton = document.querySelector('button');

// variable updated for the timeout
let timeoutID = 0;

let boxes = document.getElementsByClassName("gift-value")
let data = [];
let percent = 360 / boxes.length;
for (const box in boxes) {
    if (boxes[box].innerHTML) {
        data.push({
            rotation: (percent * box) + percent,
            color: boxes[box].getAttribute("color"),
            text: boxes[box].innerHTML
        })
    }
}

// add a random fill color to the circle behind the slices
let randomFill = '';
for (let i = 0; i < data.length; i++) {
    randomFill = data[i].color;
}
document.querySelector('svg circle#slice').style.fill = data;

function toFixedNotRound(number, precision = 1) {
    let arr = number.toString().split(".")
    let res = arr[0] + ".";
    if (arr.length > 1) {
        let arr2 = arr[1].split("");
        for (let i = 0; i < precision; i++) {
            res += arr2[i];
        }
    }
    return Number(res);
}

// create the slices, 24 in total, using a bit of trigonometry to compute the appropriate arc coordinates
for (let i = 360; i > 0; i -= percent) {
    // values for the path element
    let xCoor = 50 + Math.sin(i * Math.PI / 180) * 47;
    let yCoor = 50 - Math.cos(i * Math.PI / 180) * 47;
    xCoor = toFixedNotRound(xCoor, 2);
    yCoor = toFixedNotRound(yCoor, 2);
    const flags = i > 180 ? '0 1 1' : '0 0 1';

    // initialize a variable for the fill color
    let fill = '';
    // if the de-cremented variable matches the arbitrary rotation value of one of the objects, find the specific object
    const fillColor = data.find(d => d.rotation === i);
    // if existing, substitute the random hex with the value specified in said object
    if (fillColor) {
        fill = fillColor.color;
    }

    // create the path element and append it to the SVG container
    const path = `
    <path d="M 50 50 L 50 3 A 47 47 ${flags} ${xCoor} ${yCoor}" fill=#${fill} />
  `;
    containerSlices.innerHTML += path;
}

// function spinning the wheel
function spinWheel() {
    const randomInt = (min = 0, max = 16) => Math.floor(Math.random() * (max - min) + min);
    // remove the event listener from the button and the wheel, to avoid running the function twice at the same time
    spinButton.removeEventListener('click', spinWheel);
    pin.removeEventListener('click', spinWheel);

    // immediately hide the heading showing the matching color
    heading.classList.add('isHidden');
    // add a class to the pin and the button to show how they should not be clicked
    pin.classList.add('isSpinning');
    spinButton.classList.add('isSpinning');

    // create variables for the duration of the rotation, as whell as the number of rotations achieved by the wheel
    const randomDuration = randomInt(4, 10);
    const randomRotate = randomInt(10, 20);
    // crate a variable to pick from one of the objects at random
    const randomSuspect = randomInt(0, data.length - 1);

    // apply the transition and the transform properties
    containerSlices.style.transformOrigin = '50%';
    containerSlices.style.transition = `transform ${randomDuration}s ease-out`;
    /* for the rotation, beside an arbitrary x360 rotation, remember to
    - add 90 to match the position of the arrow (to the very right of the wheel)
    - subtract the rotation of the slices
    - add up to a slice as to have the arrow point within the slice's boundaries
    */
    containerSlices.style.transform = `rotate(${randomRotate * 360 - data[randomSuspect].rotation + 90 + randomInt(0, 360 / 24)}deg)`;

    pin.style.animation = `pinWheel ${randomDuration / 10}s 10 ease-in-out`;
    document.documentElement.style.setProperty('--color-theme', `#ffffff`);

    // after the time allocated for the rotation show the heading with the "random" color, update the custom property with its value
    timeoutID = setTimeout(() => {
        heading.textContent = `#${data[randomSuspect].text}`;
        heading.classList.remove('isHidden');
        pin.style.animation = '';
        document.documentElement.style.setProperty('--color-theme', `#${data[randomSuspect].color}`);

        // remove the class on the pin and button showing the forbidden cursor
        pin.classList.remove('isSpinning');
        spinButton.classList.remove('isSpinning');

        // reset the event listener on the button and the pin
        spinButton.addEventListener('click', spinWheel);
        pin.addEventListener('click', spinWheel);

        // clear the interval and set the boolean back to false
        clearInterval(timeoutID);
    }, randomDuration * 1000);
}

// attach a click event listener on the button, at which point call the spinWheel function
spinButton.addEventListener('click', spinWheel);

// call the same function when pressing the pin
pin.addEventListener('click', spinWheel);


