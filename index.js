//constants and skaffolding
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const diameter = 10
const maxChildren = 4
const tolerance = 15
var rounds = 0

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;


var BreakException = {};

//canvas resets
function resetCanvas() {
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
}

resetCanvas()

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//main class and logic
class Tumor {
    constructor(position) {
        this.position = position
        this.maturity = 1
        this.children = 0
    }

    draw() {
        //c.strokeStyle = 'red'
        c.fillStyle = 'black'
        c.beginPath()
        c.arc(this.position.x, this.position.y, diameter * this.maturity, 0, 2 * Math.PI)
        c.fill()
        c.closePath()
        c.stroke()
    }

    grow(tumors) {
        if (this.maturity < 8)
            this.maturity = this.maturity + 1
        if (this.maturity == 8 && this.children < 4) {
            var angle = Math.random() * Math.PI * 2
            var addx = Math.cos(angle) * diameter * this.maturity
            var addy = Math.sin(angle) * diameter * this.maturity
            this.children = this.children + 1
            tumors.push(new Tumor({
                x: this.position.x + addx,
                y: this.position.y + addy
            }))
        }
    }
}


var tumors = new Array()

function generateNewTumor() {
    tumors.push(new Tumor({
        x: getRandomInt(0.75 * canvas.width),
        y: getRandomInt(0.75 * canvas.height)
    }))
}
generateNewTumor()

tumors[0].draw()

setTimeout(tick, 1700)

function tick() {
    //c.fillRect(0, 0, canvas.width, canvas.height);
    resetCanvas()
    generateNewTumor()
    tumors.forEach(element => {
        element.grow(tumors)
        element.draw()
    });
    rounds = rounds + 1
    var newTimeout = 1700 - 35 * rounds
    if (newTimeout < 700)
        newTimeout = 700
    setTimeout(tick, newTimeout);
}

function kill(event) {
    console.log(event.clientX)
    console.log(event.clientY)
    tumors.forEach(element => {
        try {
            if (element.position.x - tolerance < event.clientX && event.clientX < element.position.x + tolerance &&
                element.position.y - tolerance < event.clientY && event.clientY < element.position.y + tolerance
            ) {
                console.log(tumors)
                var index = tumors.indexOf(element)
                tumors = tumors.filter(function (item) { return item !== element })
                console.log(tumors)
                throw BreakException
            }
        }
        catch (e) {
            if (e !== BreakException) throw e
        }
    });
}

canvas.addEventListener("click", kill);



