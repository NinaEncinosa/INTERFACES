let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

let figures = [];

const NUM_FIG = 10;
const SIZE_FIG = 20;

function addFigure() {
    if (Math.random() > 0.5) {
        addRectangle();
    } else {
        addCircle();
    }
    drawFigures();
}

function drawFigures() {
    clearCanvas("#F8F8FF", canvas);
    for (let i = 0; i < NUM_FIG; i++) {
        figures[i].draw(ctx);
    }
}

function findClickedFigure(x, y) {
    for (let index = 0; index < NUM_FIG; index++) {
        const element = figures[index];
        if (element.isPointedInside(x, y)) {
            return element;
        }
    }
}

function initExample() {
    //inicializar figuras de forma aleatoria
    for (let index = 0; index < NUM_FIG; index++) {
        if (Math.random() > 0.5) {
            addRectangle();
        } else {
            addCircle();
        }
    }

    //dibujar figuras
    drawFigures();

    //inicializar listeners
    canvas.addEventListener("click", (event) => {
        let clickedFigure = findClickedFigure(event.layerX, event.layerY);
        if (clickedFigure != null) {
            console.log("I've clicked a figure");
        } else {
            console.log("nope!");
        }
    });
}

initExample();

function addRectangle() {
    let posX = Math.round(Math.random() * canvasWidth);
    let posY = Math.round(Math.random() * canvasHeight);
    let color = randomRGBA();
    let rect = new Rect(posX, posY, SIZE_FIG, SIZE_FIG, color, ctx);
    figures.push(rect);
}

function addCircle() {
    let posX = Math.round(Math.random() * canvasWidth);
    let posY = Math.round(Math.random() * canvasHeight);
    let color = randomRGBA();
    let circle = new Circle(posX, posY, SIZE_FIG / 2, color, ctx);
    figures.push(circle);
}

// // Evento temporal para agregar figuras
// function addFigures() {
//     addFigure();
//     if (figures.length < 30) {
//         setTimeout(addFigures, 333);
//     }
// }

// // setTimeout(() => {
// //     addFigures();
// // }, 333)
// // // Fin Evento temporal para agregar figuras