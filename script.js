const containerSlices = document.querySelector('g#slices');
const pin = document.querySelector('svg#pin');
const pinText = document.querySelector('.spin__button');
const heading = document.querySelector('h1');
let boxes = document.getElementsByClassName("gift-value")
const audio = document.querySelector('audio');
const source = document.querySelector('source');
let timeoutID = 0;
const deviceWidth = document.body.offsetWidth;
const deviceHeight = document.body.offsetHeight;

for (let i = 0; i < 48; i += 1) {
    const transform = `rotate(${360 / 48 * i}), translate(0 -49.5), rotate(${-360 / 48 * i})`;
    const dot = `<circle r="0.5" cx="50" cy="50" fill="currentColor" transform="${transform}"/>`;
    containerSlices.innerHTML += dot;
}

for (let index = 0; index < boxes.length; index++) {
    boxes[index].style.color = boxes[index].getAttribute("color");
}

let data = [];
let percent = 360 / (boxes.length * 2);
for (let index = 0; index < boxes.length * 2; index++) {
    let box = index % boxes.length;
    if (boxes[box].innerHTML) {
        data.push({
            rotation: (percent * index) + percent,
            color: boxes[box].getAttribute("color"),
            text: boxes[box].innerHTML
        })
    }
}

let randomFill = '';
for (let i = 0; i < data.length; i++) {
    randomFill = data[i].color;
}

const alphabet = [
    "🎉",
    "🥳",
    "🎈",
    "🎊",
    "🎁"
];
const fontSizes = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

for (let i = 0; i < 100; i++) {
    let rand = Math.floor(Math.random() * alphabet.length);
    let element = document.createElement("span");
    element.setAttribute("id", alphabet[rand] + i);
    element.innerHTML = alphabet[rand];
    element.className = "element";
    element.style.opacity = Math.random() * 0.7;
    element.style.position = "absolute";
    element.style.left = Math.floor(Math.random() * deviceWidth - 40) + "px";
    element.style.top = Math.floor(Math.random() * deviceHeight - 40) + "px";
    element.style.animationDelay =
        Math.floor(Math.random() * (5 - 0) + 0) + "s";
    element.style.animationDuration =
        Math.floor(Math.random() * (10 - 1) + 1) + "s";
    element.style.fontSize =
        Math.floor(Math.random() * (60 - 20) + 20) + "px";
    document.getElementById("wrapper").appendChild(element);
}
document.querySelector('svg circle#slice').style.fill = data;

function toFixedNotRound(number, precision = 1) {
    let arr = number.toString().split(".")
    let res = arr[0] + ".";
    if (arr.length > 1) {
        let arr2 = arr[1].split("");
        if (arr2.length >= precision) {
            for (let i = 0; i < precision; i++) {
                res += arr2[i];
            }
        }
        else {
            for (let i = 0; i < arr2.length; i++) {
                res += arr2[i];
            }
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
        <path d="M 50 50 L 50 3 A 47 47 ${flags} ${xCoor} ${yCoor}" fill=${fill} />
      `;
    containerSlices.innerHTML += path;
}

function spinWheel() {
    const randomInt = (min = 0, max = 16) => Math.floor(Math.random() * (max - min) + min);
    pinText.removeEventListener('click', spinWheel);

    heading.classList.add('isHidden');
    pinText.classList.add('isSpinning');

    const randomDuration = randomInt(4, 10);
    const randomRotate = randomInt(0, 12);
    const randomSuspect = randomInt(0, data.length);

    containerSlices.style.transformOrigin = '50%';
    containerSlices.style.transition = `transform ${randomDuration}s ease-out`;
    containerSlices.style.transform = `rotate(${randomRotate * 360 - data[randomSuspect].rotation + 90 + randomInt(0, 360 / 24)}deg)`;

    source.src = "https://assets.mixkit.co/sfx/preview/mixkit-bike-wheel-spinning-1613.mp3";
    audio.load();
    audio.playbackRate = randomDuration / 10;
    audio.play();

    // pinText.style.animation = `pinWheel ${randomDuration / 10}s 10 ease-in-out`;
    document.documentElement.style.setProperty('--color-theme', `#ffffff`);

    timeoutID = setTimeout(() => {
        audio.playbackRate = 1;
        audio.pause()
        source.src = "https://assets.mixkit.co/sfx/preview/mixkit-audience-light-applause-354.mp3";
        audio.load();
        audio.play();
        heading.textContent = `${data[randomSuspect].text}`;
        heading.classList.remove('isHidden');
        pinText.style.animation = '';
        document.documentElement.style.setProperty('--color-theme', `${data[randomSuspect].color}`);

        pinText.classList.remove('isSpinning');

        pinText.addEventListener('click', spinWheel);

        clearInterval(timeoutID);
    }, randomDuration * 1000);
}

pinText.addEventListener('click', spinWheel);




