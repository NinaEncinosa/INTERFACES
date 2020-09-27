let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

//dimensiones de la zona donde se van a dibujar las fichas
let circlesWidth = 120;
let circlesHeight = 120;

//dimensiones de la matriz del tablero
const boardCol = 7;
const boardFil = 6;

//constantes
const NUM_FIG = boardCol * boardFil;
const SIZE_FIG = 50;
const WINNER_NUMBER = 4; //cantidad de fichas iguales para ganar!

//coordenadas de donde iniziar a dibujar las celdas del tablero (esquina superior izquierda)
let boardWidth = canvasWidth / 2 - (boardCol / 2) * SIZE_FIG - SIZE_FIG; //formula para que quede SIEMPRE centrado el canvas
let boardHeight = canvasHeight - (SIZE_FIG * (boardFil + 1.5));

//coordenadas de la zona desde donde van a estar habilitadas las fichas para ser ubicadas
let dropWidth = boardWidth;
let dropHeight = boardHeight - SIZE_FIG;

let figures = [];
let lastClickedFigure = null;
let isMouseDown = false;

initExample();

//#region inicializar juego
function initExample() {
    boardWidth = canvasWidth / 2 - (boardCol / 2) * SIZE_FIG - SIZE_FIG; //formula para que quede SIEMPRE centrado el canvas
    boardHeight = canvasHeight - (SIZE_FIG * (boardFil + 1.5));

    //coordenadas de la zona desde donde van a estar habilitadas las fichas para ser ubicadas
    dropWidth = boardWidth;
    dropHeight = boardHeight - SIZE_FIG;

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
        addCircle(_color, true, 2, _posX, _posY);
    }

    //dibujar figuras
    drawFigures();

    //inicializar listeners
    canvas.addEventListener("mousedown", onmousedown, false);
    canvas.addEventListener("mousemove", onmousemove, false);
    canvas.addEventListener("mouseup", onmouseup, false);
}

//#endregion

//#region logica del juego

//Checkeo si una ficha fue soltada en la zona habilitada para realizar jugada!
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
                        figures[i].setTurn(false);
                    } else {
                        figures[i].setTurn(true);
                    }
                }
            }
            return true;
        }
    }
    return false;
}

//Ubico la ficha depositada en la dropping zone donde corresponda!
function placeDroppedCircle(figure) {
    let dropped = false;
    //itero de atras para adelante para checkear de abajo hacia arriba si hay fichas
    for (let index = figures.length - 1; index >= 0; index--) {
        if (
            figures[index].getPosX() == figure.getPosX() && // (figura en la misma columna que la ficha)
            figures[index].getPosY() > figure.getPosY() && // (figura no tiene que estar arriba del tablero) 
            figures[index].getPosY() < boardHeight + boardFil * (SIZE_FIG + 1) //(la figura no puede estar abajo del tablero)
        ) {
            //(celda vacia)
            if (!figures[index].alreadyHasCircleInside()) {
                //agregar: decirle al juego que ahora le toca a la otra ficha jugar..!
                dropped = true;
                figure.setTurn(false);
                figure.setIsClickable(false);
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
        figure.setIsClickable(true);
        figure.setPosition(newX, newY);
        return false;
    }
}

//Checkear despues de cada ficha colocada si se terminó el juego
function isGameOver(lastFigureInserted) {
    if (
        isWinnerByFil(lastFigureInserted) ||
        isWinnerByCol(lastFigureInserted) ||
        isWinnerByDiagonal(lastFigureInserted) ||
        isTieGame()
    ) {
        return true;
    }
    return false;
}

//#endregion

//#region auxiliares para checkear si termino el juego

//checkeo si la fila 1 esta completa!
function isTieGame() {
    return false;
}


//MEJORAR HACIENDOLAS RECURSIVAS!!!! ASI ESTA MUY CROTO.

function isWinnerByCol(lastFigureInserted) {
    let x = lastClickedFigure.getPosX() - SIZE_FIG / 2; //posX de la celda que contiene la ultima ficha insertada!
    let y = lastFigureInserted.getPosY() - SIZE_FIG / 2; //posX de la celda que contiene la ultima ficha insertada!
    let lineof = WINNER_NUMBER;
    let indexCell = getFigureByCoord(x, y); //"id" de la figura celda que contiene la ultima ficha insertada

    while (
        y < boardHeight && // (altura dentro del tablero)
        lineof > 0 && // (lineof = 0 -> gano!)
        figures[indexCell].getPlayer() == lastFigureInserted.getPlayer() // (iterar mientras la ficha en la celda sea del mismo jugador)
    ) {
        y = y + SIZE_FIG;
        indexCell = getFigureByCoord(x, y);
        lineof--;
    }
    if (lineof == 0) {
        y = lastFigureInserted.getPosY() - SIZE_FIG / 2;
        indexCell = getFigureByCoord(x, y);
        figures[indexCell].setFill("lightblue");
        while (
            y < boardHeight &&
            figures[indexCell].getPlayer() == lastFigureInserted.getPlayer()
        ) {
            figures[indexCell].setFill("lightblue");
            y = y + SIZE_FIG;
            indexCell = getFigureByCoord(x, y);
        }
        return true;
    }
}

function isWinnerByFil(lastFigureInserted) {
    let x = lastClickedFigure.getPosX() - SIZE_FIG / 2; //posX de la celda que contiene la ultima ficha insertada!
    let y = lastFigureInserted.getPosY() - SIZE_FIG / 2; //posX de la celda que contiene la ultima ficha insertada!
    let lineof = WINNER_NUMBER;
    let indexCell = getFigureByCoord(x, y); //"id" de la figura celda que contiene la ultima ficha insertada

    //busco la ficha del mismo jugador lo mas a la izq posible en la misma fila
    //agregar que no se vaya de rango para arriba, ejemplo ficha en 1er col con la col ya completa
    while (
        x > boardWidth && // (no se pasa de la izq del tablero)
        figures[indexCell].getPlayer() == lastFigureInserted.getPlayer() // (iterar mientras la ficha en la celda sea del mismo jugador)
    ) {
        x = x - SIZE_FIG;
        indexCell = getFigureByCoord(x, y);
    }

    //cuando termina el while me pase por 1 celda asique reestablesco:
    x = x + SIZE_FIG;
    indexCell = getFigureByCoord(x, y);

    //a partir de la ficha que obtube arranco a checkear si hay 4 iguales
    while (
        x <= (boardWidth + (boardCol * SIZE_FIG)) && // (no se pasa de la der del tablero)
        lineof > 0 && // (lineof = 0 -> gano!)
        figures[indexCell].getPlayer() == lastFigureInserted.getPlayer() // (iterar mientras la ficha en la celda sea del mismo jugador)
    ) {
        x = x + SIZE_FIG;
        indexCell = getFigureByCoord(x, y);
        lineof--;
    }

    // (lineof = 0 -> gano!)
    if (lineof == 0) {
        //reestablesco valores
        x = x - SIZE_FIG;
        indexCell = getFigureByCoord(x, y);

        //pinto la jugada ganadora
        while (
            x > boardWidth && // (no se pasa de la izq del tablero)
            figures[indexCell].getPlayer() == lastFigureInserted.getPlayer() // (iterar mientras la ficha en la celda sea del mismo jugador)
        ) {
            figures[indexCell].setFill("lightblue");
            x = x - SIZE_FIG;
            indexCell = getFigureByCoord(x, y);

        }
        return true;
    }
}


function isWinnerByDiagonal(lastFigureInserted) {
    if (isWinnerByDiagonalDown(lastFigureInserted) || isWinnerByDiagonalUp(lastFigureInserted)) {
        return true;
    }
}

function isWinnerByDiagonalDown(lastFigureInserted) {
    let x = lastClickedFigure.getPosX() - SIZE_FIG / 2; //posX de la celda que contiene la ultima ficha insertada!
    let y = lastFigureInserted.getPosY() - SIZE_FIG / 2; //posX de la celda que contiene la ultima ficha insertada!
    let lineof = WINNER_NUMBER;
    let indexCell = getFigureByCoord(x, y); //"id" de la figura celda que contiene la ultima ficha insertada

    //busco la pos mas a la izq arriba en la diagonal que tenga ficha igual
    while (
        x > boardWidth && // // (no pasarme de la izq del tablero)
        y < boardHeight && // (altura dentro del tablero)
        //meter en un if adentro del while (como en isWinn..Up() )por que sino rompe la ultima ficha insertada de una col
        figures[indexCell].getPlayer() == lastFigureInserted.getPlayer() // (iterar mientras la ficha en la celda sea del mismo jugador)
    ) {
        x = x - SIZE_FIG;
        y = y - SIZE_FIG;
        indexCell = getFigureByCoord(x, y);
    }

    //como me paso por 1, reestablezco valores
    x = x + SIZE_FIG;
    y = y + SIZE_FIG;
    indexCell = getFigureByCoord(x, y);


    //comienzo a contar desde la posicion que obtube, si hay 4 en linea
    while (
        x <= (boardWidth + (boardCol * SIZE_FIG)) && // (no se pasa de la der del tablero)
        y < boardHeight && // (altura dentro del tablero)
        lineof > 0 && // (lineof = 0 -> gano!)
        figures[indexCell].getPlayer() == lastFigureInserted.getPlayer() // (iterar mientras la ficha en la celda sea del mismo jugador)
    ) {
        x = x + SIZE_FIG;
        y = y + SIZE_FIG;
        indexCell = getFigureByCoord(x, y);
        lineof--;
    }

    if (lineof == 0) {
        x = x - SIZE_FIG;
        y = y - SIZE_FIG;
        indexCell = getFigureByCoord(x, y);
        figures[indexCell].setFill("lightblue");
        //en caso de haber ganado pinto las fichas ganadoras!
        while (
            x > boardWidth && // (ancho dentro del tablero)
            y < boardHeight && // (altura dentro del tablero)
            figures[indexCell].getPlayer() == lastFigureInserted.getPlayer() // (iterar mientras la ficha en la celda sea del mismo jugador)
        ) {
            figures[indexCell].setFill("lightblue");
            x = x - SIZE_FIG;
            y = y - SIZE_FIG;
            indexCell = getFigureByCoord(x, y);
        }
        return true;
    }
}

function isWinnerByDiagonalUp(lastFigureInserted) {
    let x = lastClickedFigure.getPosX() - SIZE_FIG / 2; //posX de la celda que contiene la ultima ficha insertada!
    let y = lastFigureInserted.getPosY() - SIZE_FIG / 2; //posY de la celda que contiene la ultima ficha insertada!
    let lineof = WINNER_NUMBER;
    let counted = 0;
    let indexCell = getFigureByCoord(x, y); //"id" de la figura celda que contiene la ultima ficha insertada

    //busco la pos mas a la izq abajo en la diagonal que tenga ficha igual
    while ((x > boardWidth) && (y <= boardHeight - SIZE_FIG)) {
        if (figures[indexCell].getPlayer() == lastFigureInserted.getPlayer()) {
            counted++;
            x = x - SIZE_FIG;
            y = y + SIZE_FIG;
            indexCell = getFigureByCoord(x, y);

        } else {
            x = x - SIZE_FIG;
            y = y + SIZE_FIG;
        }

    }

    //las ccordenadas de esa ficha encontraba 
    x = (lastClickedFigure.getPosX() - SIZE_FIG / 2) - (SIZE_FIG * (counted - 1));
    y = (lastFigureInserted.getPosY() - SIZE_FIG / 2) + (SIZE_FIG * (counted - 1));
    indexCell = getFigureByCoord(x, y);

    if (counted == WINNER_NUMBER) {
        while (x <= (lastClickedFigure.getPosX() - SIZE_FIG / 2)) {
            figures[indexCell].setFill("lightblue");
            x = x + SIZE_FIG;
            y = y - SIZE_FIG;
            indexCell = getFigureByCoord(x, y);
        }
        return true;
    } else {
        let xaux = x;
        let yaux = y;
        let indexx = indexCell;
        while (
            x <= (boardWidth + (boardCol * SIZE_FIG)) && // (no se pasa de la der del tablero)
            y <= boardHeight && // (altura dentro del tablero)
            lineof > 0 && // (lineof = 0 -> gano!)
            figures[indexCell].getPlayer() == lastFigureInserted.getPlayer() // (iterar mientras la ficha en la celda sea del mismo jugador)
        ) {
            x = x + SIZE_FIG;
            y = y - SIZE_FIG;
            indexCell = getFigureByCoord(x, y);
            lineof--;
        }

        if (lineof == 0) {
            while (lineof < WINNER_NUMBER) {
                figures[indexx].setFill("lightblue");
                xaux = xaux + SIZE_FIG;
                yaux = yaux - SIZE_FIG;
                indexx = getFigureByCoord(xaux, yaux);
                lineof++;
            }
            return true;
        }


    }

}

//#endregion

//#region mouse events
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
                //en algun lado agregar un timeout asi veo la jugada ganadora!
                endGame();
                drawFigures();
                // figures = [];
                // //simulo un click por que sino me queda la ultima ficha dibujada en el nuevo tablero!
                // onmousedown(event);
                // initExample();
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

//#region funciones auxiliares generales

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

//Si una ficha fue soltada arriba del tablero la corro para que no estorbe!
function isInBoardZone(figure) {
    for (let index = 0; index < figures.length; index++) {
        const element = figures[index];
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

//#region dibujar/borrar figuras

function clearCanvas(color, canvas) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function addRectangle(x, y) {
    let color = "#ffdac1";
    let rect = new Rect(x, y, SIZE_FIG, SIZE_FIG, color, ctx);
    figures.push(rect);
}

//se podran colocar fichas desde la pos 0 del canvas hasta donde inizia el tablero. 
function addDropZone(x, y) {
    let color = "white";
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