let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

let circlesWidth = 120;
let circlesHeight = 120;

let boardCol = 7;
let boardFil = 5;

//una de las condiciones de corte del juego podria ser que no hay mas fichas
const NUM_FIG = boardCol * boardFil;
const SIZE_FIG = 50;
const WINNER_NUMBER = 4; //cantidad de fichas iguales para ganar!

//formula para que quede SIEMPRE centrado el canvas
let boardWidth = canvasWidth / 2 - (boardCol / 2) * SIZE_FIG - SIZE_FIG;
let boardHeight = canvasHeight * 0.1;

let dropWidth = boardWidth;
let dropHeight = canvasHeight * 0.1 - SIZE_FIG;

let figures = [];
let lastClickedFigure = null;
let isMouseDown = false;

function isInBoardZone(figure) {
    for (let index = 0; index < figures.length; index++) {
        const element = figures[index];
        //si una ficha es dejada arriba del tablero la muevo
        if (element.isCircleInside(figure.getPosX(), figure.getPosY())) {
            //quizas mejora: reubicar la ficha en la zona de pilita de fichas original (izq o derecha)
            figure.setPosition(
                figures[index].getPosX() -
                (figures[index].getPosX() - figure.getPosX()),
                boardHeight + SIZE_FIG
            );
            return true;
        }
    }
    return false;
}


function isGameOver(lastFigureInserted) {
    if (
        isWinnerByFil(lastFigureInserted) ||
        isWinnerByCol(lastFigureInserted) ||
        isWinnerByDiagonal(lastFigureInserted)
        //or isBoardCompletlyFull() == true; -> chechear si la fila 0 esta llena!
    ) {
        return true;
    }
    return false;
}

function isInDroppingZone(figure) {
    for (let index = 0; index < figures.length; index++) {
        const element = figures[index];
        if (
            element.isCircleInsideDrop(figure.getPosX(), figure.getPosY(), figure)
        ) {
            if (placeDroppedCircle(figure)) {
                let player = figure.getPlayer();
                for (let i = 0; i < figures.length; i++) {
                    if (figures[i].getPlayer() == player) {
                        figures[i].setIsInBoard(true);
                    } else {
                        figures[i].setIsInBoard(false);
                    }
                }
            }
            return true;
        }
    }
    return false;
}

function placeDroppedCircle(figure) {
    let dropped = false;
    //itero de atras para adelante para checkear de abajo hacia arriba si hay fichas
    for (let index = figures.length - 1; index >= 0; index--) {
        //(figura en la misma columna que la ficha) && (figura no tiene que estar arriba del tablero) && (la figura no puede estar abajo del tablero)
        if (
            figures[index].getPosX() == figure.getPosX() &&
            figures[index].getPosY() > figure.getPosY() &&
            figures[index].getPosY() < boardHeight + boardFil * (SIZE_FIG + 1)
        ) {
            //extraer este cachito de codigo
            if (!figures[index].alreadyHasCircleInside()) {
                //agregar: decirle al juego que ahora le toca a la otra ficha jugar..!
                dropped = true;
                figure.setIsInBoard(true);
                figure.setPosition(
                    figures[index].getPosX() + SIZE_FIG / 2,
                    figures[index].getPosY() + SIZE_FIG / 2
                );
                return true;
            }
        }
        if (dropped == false) {
            newX = figure.getPosX() + SIZE_FIG / 2;
            newY = boardHeight + SIZE_FIG;
        }
    }

    if (dropped == false) {
        figure.setIsInBoard(false);
        figure.setPosition(newX, newY);
        return false;
    }
}

function drawFigures() {
    clearCanvas("#f8c471", canvas);
    for (let i = 0; i < figures.length; i++) {
        if (figures[i] != lastClickedFigure) {
            figures[i].draw(ctx);
        }
    }
    if (lastClickedFigure != null) {
        lastClickedFigure.draw(ctx);
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

function onmousedown(event) {
    isMouseDown = true;

    //se limpia la propiedad highlighted de la ultima figura clickeada para buscar la nueva
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
                console.log(
                    "termino el juego! Felicitaciones, gano el player: " +
                    lastClickedFigure.getPlayer()
                );
                //aca reiniciar juego
            }

        } else if (isInBoardZone(lastClickedFigure)) {
            console.log("figura arriba del tablero");
        }
        lastClickedFigure.setHighlighted(false);
    }
    drawFigures();
}

function initExample() {
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
        let _posY =
            canvasHeight - SIZE_FIG / 2 - Math.round(Math.random() * circlesHeight);
        let _color = "#ffb0c1";
        addCircle(_color, true, 1, _posX, _posY);

        _posX =
            canvasWidth - SIZE_FIG / 2 - Math.round(Math.random() * circlesWidth);
        _posY =
            canvasHeight - SIZE_FIG / 2 - Math.round(Math.random() * circlesHeight);
        _color = "blue";
        addCircle(_color, false, 2, _posX, _posY);
    }

    //dibujar figuras
    drawFigures();

    //inicializar listeners
    canvas.addEventListener("mousedown", onmousedown, false);
    canvas.addEventListener("mousemove", onmousemove, false);
    canvas.addEventListener("mouseup", onmouseup, false);
}

initExample();