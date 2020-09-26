function clearCanvas(color, canvas) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function addRectangle(x, y) {
    let color = "#ffdac1";
    let rect = new Rect(x, y, SIZE_FIG, SIZE_FIG, color, ctx);
    figures.push(rect);
}

function addDropZone(x, y) {
    let color = "white";
    let dropZone = new DropZone(x, y, SIZE_FIG, SIZE_FIG, color, ctx);
    figures.push(dropZone);
}

function addCircle(_color, _turn, _player, _posX, _posY) {
    let isInBoard = false;
    let player = _player;
    let posX = _posX;
    let posY = _posY;
    let color = _color;
    let circle = new Circle(player, _turn, posX, posY, (SIZE_FIG / 2) * .5, color, isInBoard, ctx);
    figures.push(circle);
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

function isWinnerByDiagonalDown(lastFigureInserted) {
    let x = lastClickedFigure.getPosX() - SIZE_FIG / 2; //posX de la celda que contiene la ultima ficha insertada!
    let y = lastFigureInserted.getPosY() - SIZE_FIG / 2; //posX de la celda que contiene la ultima ficha insertada!
    let lineof = WINNER_NUMBER;
    let indexCell = getFigureByCoord(x, y); //"id" de la figura celda que contiene la ultima ficha insertada

    //busco la pos mas a la izq arriba en la diagonal que tenga ficha igual
    while (
        x > boardWidth && // // (no pasarme de la izq del tablero)
        y < boardHeight && // (altura dentro del tablero)
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

function isWinnerByDiagonal(lastFigureInserted) {
    if (isWinnerByDiagonalDown(lastFigureInserted) || isWinnerByDiagonalUp(lastFigureInserted)) {
        return true;
    }
}

function getFigureByCoord(x, y) {
    for (let i = 0; i < figures.length; i++) {
        if (figures[i].getPosX() == x && figures[i].getPosY() == y) {
            return i;
        }
    }
    return null;
}