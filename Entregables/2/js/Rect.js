class Rect extends Figure {

    constructor(posX, posY, width, height, fill, context) {
        super(posX, posY, fill, context);
        this.width = width;
        this.height = height;
    }

    draw() {
        super.draw();
        this.context.fillRect(this.posX, this.posY, this.width, this.height);
        this.context.strokeStyle = "black";
        this.context.lineWidth = 3;
        this.context.strokeRect(this.posX, this.posY, this.width, this.height);
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    //esta mal el nombre, devuelve si el circulo que le paso "x,y" cae en ese rectangulo en especial o no (el rectangulo que llamo al metodo)..
    isCircleInside(x, y) {
        let isInside = !(x < this.posX || x > this.posX + this.width || y < this.posY || y > this.posY + this.height);
        return isInside;
    }


    alreadyHasCircleInside() {
        let cellWithFigureInside = false;
        for (let index = 0; index < figures.length; index++) {
            if (figures[index] != this) {
                if ((!(figures[index].getPosX() <= this.posX || figures[index].getPosX() >= this.posX + this.width || figures[index].getPosY() <= this.posY || figures[index].getPosY() >= this.posY + this.height)) == true) {
                    return true;
                }
            }

        }
        return cellWithFigureInside;
    }

    getPlayer() {
        if (this.alreadyHasCircleInside()) {
            //obtengo coordenadas de la ficha de adentro..
            let x = this.getPosX() + (SIZE_FIG / 2);
            let y = this.getPosY() + (SIZE_FIG / 2);

            for (let index = 0; index < figures.length; index++) {
                //busco que ficha es la que tiene esas coordenadas
                if ((figures[index].getPosX() == x) && (figures[index].getPosY() == y)) {
                    return figures[index].getPlayer();

                }
            }

        }
        return 0;
    }
}