const containerSlices = document.querySelector('g#slices');
const pin = document.querySelector('svg#pin');

for (let i = 0; i < 48; i += 1) {
    const transform = `rotate(${360 / 48 * i}), translate(0 -49.5), rotate(${-360 / 48 * i})`;
    const dot = `<circle r="0.5" cx="50" cy="50" fill="currentColor" transform="${transform}"/>`;
    containerSlices.innerHTML += dot;
}

const heading = document.querySelector('h1');
const spinButton = document.querySelector('button');

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

for (let i = 360; i > 0; i -= percent) {
    let xCoor = 50 + Math.sin(i * Math.PI / 180) * 47;
    let yCoor = 50 - Math.cos(i * Math.PI / 180) * 47;
    xCoor = toFixedNotRound(xCoor, 2);
    yCoor = toFixedNotRound(yCoor, 2);
    const flags = i > 180 ? '0 1 1' : '0 0 1';

    let fill = '';
    const fillColor = data.find(d => d.rotation === i);
    if (fillColor) {
        fill = fillColor.color;
    }

    const path = `
    <path d="M 50 50 L 50 3 A 47 47 ${flags} ${xCoor} ${yCoor}" fill=#${fill} />
  `;
    containerSlices.innerHTML += path;
}

function spinWheel() {
    const randomInt = (min = 0, max = 16) => Math.floor(Math.random() * (max - min) + min);
    spinButton.removeEventListener('click', spinWheel);
    pin.removeEventListener('click', spinWheel);

    heading.classList.add('isHidden');
    pin.classList.add('isSpinning');
    spinButton.classList.add('isSpinning');

    const randomDuration = randomInt(4, 10);
    const randomRotate = randomInt(10, 20);
    const randomSuspect = randomInt(0, data.length - 1);

    containerSlices.style.transformOrigin = '50%';
    containerSlices.style.transition = `transform ${randomDuration}s ease-out`;
    containerSlices.style.transform = `rotate(${randomRotate * 360 - data[randomSuspect].rotation + 90 + randomInt(0, 360 / 24)}deg)`;

    pin.style.animation = `pinWheel ${randomDuration / 10}s 10 ease-in-out`;
    document.documentElement.style.setProperty('--color-theme', `#ffffff`);

    timeoutID = setTimeout(() => {
        heading.textContent = `#${data[randomSuspect].text}`;
        heading.classList.remove('isHidden');
        pin.style.animation = '';
        document.documentElement.style.setProperty('--color-theme', `#${data[randomSuspect].color}`);

        pin.classList.remove('isSpinning');
        spinButton.classList.remove('isSpinning');

        spinButton.addEventListener('click', spinWheel);
        pin.addEventListener('click', spinWheel);

        clearInterval(timeoutID);
    }, randomDuration * 1000);
}

spinButton.addEventListener('click', spinWheel);

pin.addEventListener('click', spinWheel);


