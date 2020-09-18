class Rect extends Figure {
    constructor(posX, posY, width, height, fill, context) {
        super(posX, posY, fill, context);

        this.width = width;
        this.height = height;
    }

    draw() {
        super.draw();
        this.context.fillRect(this.posX, this.posY, this.width, this.height);
    }

    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }

    isPointedInside(x, y) {
        let isInside = !(x < this.posX || x > this.posX + this.width || y < this.posY || y > this.posY + this.height);
        return isInside;
    }
}