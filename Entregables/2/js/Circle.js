class Circle extends Figure {
    constructor(player, turn, posX, posY, radius, fill, isInBoard, context) {
        super(posX, posY, fill, context);
        this.player = player;
        this.turn = turn; //sacar, no lo use nunca.. en vez use el de abajo que deberia cambiarle el nombre..! (EVALUAR, QUIZAS LA NECESITE EH!)
        this.isInBoard = isInBoard; // cambiar nombre por dragueable/clickeable o algo asi..
        this.highlighted = false;
        this.highlightedStyle = "yellow";
        this.radius = radius;
    }

    draw() {
        super.draw();
        this.context.beginPath();
        this.context.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
        this.context.fill();

        this.context.strokeStyle = "Black";
        this.context.lineWidth = 5;
        this.context.stroke();

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

    setIsInBoard(param) {
        this.isInBoard = param;
    }

    isPointedInside(x, y) {
        if (this.isInBoard == false) {
            let _x = this.posX - x;
            let _y = this.posY - y;
            let isInside = Math.sqrt(_x * _x + _y * _y) < this.radius;
            return isInside;
        }
    }

}