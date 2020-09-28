class Circle extends Figure {
    constructor(player, turn, posX, posY, radius, fill, context) {
        super(posX, posY, fill, context);
        this.player = player;
        this.turn = turn;
        this.isClickable = true;
        this.highlighted = false;
        this.highlightedStyle = "yellow";
        this.radius = radius;
        this.urlimage = fill;
        this.image = new Image();
    }

    draw() {
        super.draw();
        this.context.beginPath();
        this.context.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);

        // this.context.strokeStyle = "Black";
        // this.context.lineWidth = 3;
        // this.context.stroke();
        if (this.image.src === "") {
            this.image.src = this.urlimage;
            let loadImg = function () {
                this.context.drawImage(this.image, this.posX - this.radius, this.posY - this.radius, SIZE_FIG / 2, SIZE_FIG / 2);
            }
            this.image.onload = loadImg.bind(this);
        } else {
            this.context.drawImage(this.image, this.posX - this.radius, this.posY - this.radius, SIZE_FIG / 2, SIZE_FIG / 2);
        }

        if (this.highlighted === true) {
            this.context.strokeStyle = this.highlightedStyle;
            this.context.lineWidth = 5;
            this.context.stroke();
        }
        this.context.closePath();
    }

    getRadius() {
        return this.radius;
    }

    getPlayer() {
        return this.player;
    }

    setIsClickable(param) {
        this.isClickable = param;
    }

    isPointedInside(x, y) {
        if ((this.isClickable == true) && (this.turn == true)) {
            let _x = this.posX - x;
            let _y = this.posY - y;
            let isInside = Math.sqrt(_x * _x + _y * _y) < this.radius;
            return isInside;
        }
    }

    setTurn(param) {
        this.turn = param;
    }

}