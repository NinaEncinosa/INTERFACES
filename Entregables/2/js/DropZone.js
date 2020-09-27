class DropZone extends Figure {

    constructor(posX, posY, width, height, fill, context) {
        super(posX, posY, fill, context);
        this.width = width;
        this.height = height;
    }

    draw() {
        // super.draw();
        // this.context.fillRect(this.posX, this.posY, this.width, this.height);
        // this.context.strokeStyle = "black";
        // this.context.lineWidth = 3;
        // this.context.strokeRect(this.posX, this.posY, this.width, this.height);
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    isCircleInsideDrop(x, y, figure) {
        let isInside = !(x < this.posX || x > this.posX + this.width || y < this.posY || y > this.posY + this.height);

        //Ubica la ficha en el centro de la columna en la "dropping zone"
        if (isInside == true) {
            figure.setPosition(this.posX, this.posY);
        }
        return isInside;
    }


}