"use strict";
window.addEventListener("load", () => {
    //Variables
    let canvas = document.querySelector("#canvas");
    let ctx = canvas.getContext("2d");
    let clean = document.querySelector("#whiteCanvas");
    let pencil = document.querySelector("#pencil");
    let eraser = document.querySelector("#eraser");
    let marker = document.querySelector("#marker");

    let erase = false;
    let painting = false;


    //EventListeners
    clean.addEventListener("click", canvasBlanco);
    pencil.addEventListener("click", enablePencil);
    marker.addEventListener("click", enableMarker);
    eraser.addEventListener("click", enableEraser);


    //Funciones
    function canvasBlanco() {
        ctx.fillStyle = "whitesmoke";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
    }

    function startPosition() {
        painting = true;
        draw();
    }

    function finishPosition() {
        painting = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!painting) return;
        if (!erase) ctx.strokeStyle = document.querySelector("#html5colorpicker").value;
        ctx.lineWidth = document.querySelector("#slider-size").value;
        ctx.lineTo(e.clientX - this.offsetLeft, e.clientY - this.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - this.offsetLeft, e.clientY - this.offsetTop);
    }

    function enablePencil() {
        ctx.strokeStyle = document.querySelector("#html5colorpicker").value;
        ctx.lineCap = "round";
        erase = false;
        canvas.addEventListener("mousedown", startPosition);
        canvas.addEventListener("mouseup", finishPosition);
        canvas.addEventListener("mousemove", draw);
    }

    function enableEraser() {
        ctx.strokeStyle = "whitesmoke";
        ctx.lineCap = "round";
        erase = true;
        canvas.addEventListener("mousedown", startPosition);
        canvas.addEventListener("mouseup", finishPosition);
        canvas.addEventListener("mousemove", draw);
    }

    function enableMarker() {
        ctx.strokeStyle = document.querySelector("#html5colorpicker").value;
        ctx.lineCap = "square";
        erase = false;
        canvas.addEventListener("mousedown", startPosition);
        canvas.addEventListener("mouseup", finishPosition);
        canvas.addEventListener("mousemove", draw);
    }


});