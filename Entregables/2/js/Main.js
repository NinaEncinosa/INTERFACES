let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let background = new Image();

//dimensiones de la matriz del tablero
const boardCol = 6;
const boardFil = 5;

//constantes
const NUM_FIG = boardCol * boardFil;
const SIZE_FIG = 75;
const WINNER_NUMBER = 4; //cantidad de fichas iguales para ganar!

const urlPlayer1 = "./img/player1.png";
const urlPlayer2 = "./img/player2.png";
const urlBackground = "./img/background.jpg";
const urlBoardCell = "./img/tab_vacio.png";

//#region calculo de dimensiones de manera proporcional

//coordenadas de donde iniziar a dibujar las celdas del tablero (esquina superior izquierda)
let boardWidth = (canvasWidth / 2) - (boardCol / 2) * SIZE_FIG - SIZE_FIG; //formula para que quede SIEMPRE centrado el canvas
let boardHeight = canvasHeight - (SIZE_FIG * (boardFil + 1.5));

//dimensiones de la zona donde se van a dibujar las fichas
let circlesWidth = boardWidth;
let circlesHeight = canvasHeight / 2;

//coordenadas de la zona desde donde van a estar habilitadas las fichas para ser ubicadas
let dropWidth = boardWidth;
let dropHeight = boardHeight - SIZE_FIG;

let figures = [];
let tokensPlayed = 0;
let lastClickedFigure = null;
let isMouseDown = false;

//#endregion

initExample();

//#region inicializar juego
function initExample() {
    //reescribo los valores originales para luego poder invocar a initExample() y resetear juego
    boardWidth = canvasWidth / 2 - (boardCol / 2) * SIZE_FIG - SIZE_FIG;
    boardHeight = canvasHeight - (SIZE_FIG * (boardFil + 1.5));


    //coordenadas de la zona desde donde van a estar habilitadas las fichas para ser ubicadas
    dropWidth = boardWidth;
    dropHeight = boardHeight - SIZE_FIG;

    //#region crear las figuras 

    //crear la matriz del tablero
    for (let x = 0; x < boardFil; x++) {
        for (let y = 0; y < boardCol; y++) {
            boardWidth += SIZE_FIG;
            addRectangle(boardWidth, boardHeight);
        }
        boardWidth -= SIZE_FIG * boardCol;
        boardHeight += SIZE_FIG;
    }

    //crear el arreglo donde seria la "dropping zone"
    for (let x = 0; x < boardCol; x++) {
        dropWidth += SIZE_FIG;
        addDropZone(dropWidth, dropHeight);
    }

    //crear las fichas de cada jugador
    for (let index = 0; index < NUM_FIG / 2; index++) {
        let _posX = SIZE_FIG / 2 + Math.round(Math.random() * circlesWidth);
        let _posY = canvasHeight - SIZE_FIG / 2 - Math.round(Math.random() * circlesHeight);
        let _color = urlPlayer1;
        addCircle(_color, true, 1, _posX, _posY);

        _posX =
            canvasWidth - SIZE_FIG / 2 - Math.round(Math.random() * circlesWidth);
        _posY =
            canvasHeight - SIZE_FIG / 2 - Math.round(Math.random() * circlesHeight);
        _color = urlPlayer2;
        addCircle(_color, true, 2, _posX, _posY);
    }

    //#endregion

    drawFigures();

    //inicializar listeners
    canvas.addEventListener("mousedown", onmousedown, false);
    canvas.addEventListener("mousemove", onmousemove, false);
    canvas.addEventListener("mouseup", onmouseup, false);

}

//#endregion

//#region mouse events
function onmousedown(event) {
    isMouseDown = true;
    if (lastClickedFigure != null) {
        lastClickedFigure.setHighlighted(false);
        lastClickedFigure = null;
    }

    let clickedFigure = findClickedFigure(event.layerX, event.layerY);
    if (clickedFigure != null) {
        clickedFigure.setHighlighted(true);
        lastClickedFigure = clickedFigure;
    }
    drawFigures();
}

function onmousemove(event) {
    if (isMouseDown && lastClickedFigure != null) {
        lastClickedFigure.setPosition(event.layerX, event.layerY);
        drawFigures();
        if (lastClickedFigure != null) {
            lastClickedFigure.draw(ctx);
        }
    }
}

function onmouseup(event) {
    isMouseDown = false;
    if (lastClickedFigure != null) {
        if (isInDroppingZone(lastClickedFigure)) {
            //mostrar en un futuro el turno de quien es ahora
            if (isGameOver(lastClickedFigure)) {
                //en algun lado agregar un timeout asi veo la jugada ganadora!
                //alert("Gano Player: " + lastClickedFigure.getPlayer());
                endGame();
                drawFigures();
                return
            }

        } else if (isInBoardZone(lastClickedFigure)) {
            console.log("figura arriba del tablero");
        }
        lastClickedFigure.setHighlighted(false);
    }
    drawFigures();
}
//#endregion

//#region dibujar figuras

function addRectangle(x, y) {
    let color = urlBoardCell;
    let rect = new Rect(x, y, SIZE_FIG, SIZE_FIG, color, ctx);
    figures.push(rect);
}

//se podran colocar fichas desde la pos 0 del canvas hasta donde inizia el tablero. 
function addDropZone(x, y) {
    let color = "white"; //agregar img flechitas o algo asi..!
    let dropZone = new DropZone(x, 0, SIZE_FIG, boardHeight - (boardFil * SIZE_FIG), color, ctx);
    figures.push(dropZone);
}

function addCircle(_color, _turn, _player, _posX, _posY) {
    let player = _player;
    let posX = _posX;
    let posY = _posY;
    let color = _color;
    let circle = new Circle(player, _turn, posX, posY, (SIZE_FIG / 2) * .5, color, ctx);
    figures.push(circle);
}

//#endregion

//#region funciones auxiliares generales

function drawFigures() {
    clearCanvas();
    for (let i = 0; i < figures.length; i++) {
        if (figures[i] != lastClickedFigure) {
            figures[i].draw(ctx);
        }
    }
    if (lastClickedFigure != null) {
        lastClickedFigure.draw(ctx);
    }
}

function clearCanvas() {
    if (background.src === "") {
        background.src = urlBackground;
        let cargarImg = function () {
            ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
        }
        background.onload = cargarImg.bind(this);
    } else {
        ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
    }
}

function findClickedFigure(x, y) {
    for (let index = 0; index < figures.length; index++) {
        const element = figures[index];
        if (element.isPointedInside(x, y)) {
            return element;
        }
    }
}

//Si una ficha fue soltada arriba del tablero la corro para que no estorbe!
function isInBoardZone(token) {
    for (let index = 0; index < figures.length; index++) {
        const element = figures[index];
        if (element.isTokenInside(token.getPosX(), token.getPosY())) {
            //quizas mejora: reubicar la ficha en la zona de pilita de fichas original (izq o derecha)
            token.setPosition(
                figures[index].getPosX() -
                (figures[index].getPosX() - token.getPosX()),
                boardHeight + SIZE_FIG
            );
            return true;
        }
    }
    return false;
}

//Una vez que ya se que estoy en el tablero, esta funcion me devuelve el "id" de una figura en (x,y)
function getFigureByCoord(x, y) {
    for (let i = 0; i < figures.length; i++) {
        if (figures[i].getPosX() == x && figures[i].getPosY() == y) {
            return i;
        }
    }
    return null;
}

//Desabilitar el movimiento de todas las fichas, usado cuando termina el juego
function endGame() {
    for (let index = 0; index < figures.length; index++) {
        figures[index].setIsClickable(false);
    }
}

//#endregion