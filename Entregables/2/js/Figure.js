class Figure {
    constructor(posX, posY, fill, context) {
        this.posX = posX;
        this.posY = posY;
        this.fill = fill;
        this.context = context;
        this.param = false;
    }

    setFill(fill) {
        this.fill = fill;
    }

    getPosition() {
        return {
            x: this.getPosX(),
            y: this.getPosY()
        };
    }

    setPosition(x, y) {
        this.posX = x;
        this.posY = y;
    }

    getPosX() {
        return this.posX;
    }

    getPosY() {
        return this.posY;
    }

    getFill() {
        return this.fill;
    }

    setHighlighted(value) {
        this.highlighted = value;
    }

    setHighlightedStyle(style) {
        this.highlightedStyle = style;
    }

    //abstract methods
    draw() {
        this.context.fillStyle = this.fill;
    }

    setIsClickable(param) {}

    isPointedInside(x, y) {}

    isCircleInsideDrop(x, y, figure) {}

    isCircleInside(figure) {}

    alreadyHasCircleInside() {}

    getPlayer() {};

    setTurn(param) {}

}