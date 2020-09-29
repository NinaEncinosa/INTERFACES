class DropZone extends Figure {

    constructor(posX, posY, width, height, fill, context) {
        super(posX, posY, fill, context);
        this.urlimage = fill;
        this.image = new Image();
        this.width = width;
        this.height = height;
    }

    draw() {
        super.draw();
        if (this.image.src === "") {
            this.image.src = this.urlimage;
            let loadImg = function () {
                this.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
            }
            this.image.onload = loadImg.bind(this);

        } else {
            this.context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
        }
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    isTokenInsideDroppingZone(figure) {
        let x = figure.getPosX();
        let y = figure.getPosY();
        let isInside = !(x < this.posX || x > this.posX + this.width || y < this.posY || y > this.posY + this.height);
        //Ubica la ficha en el centro de la columna en la "dropping zone"
        if (isInside == true) {
            figure.setPosition(this.posX, this.posY);
        }
        return isInside;
    }


}