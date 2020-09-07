"use strict";
window.addEventListener("load", () => {
    let canvas = document.querySelector("#canvas");
    let ctx = canvas.getContext("2d");
    let painting = false;
    let pencil = document.querySelector("#pencil");
    let eraser = document.querySelector("#eraser");
    let rectangle = document.querySelector("#rectangle");
    let downloader = document.querySelector("#download");
    let erase = false;

    //EventListeners
    pencil.addEventListener("click", enablePencil);
    eraser.addEventListener("click", enableEraser);
    rectangle.addEventListener("click", enableRectagle);
    downloader.addEventListener("click", download);

    //funciones
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

    function enableRectagle() {
        ctx.strokeStyle = document.querySelector("#html5colorpicker").value;
        ctx.lineCap = "square";
        erase = false;
        canvas.addEventListener("mousedown", startPosition);
        canvas.addEventListener("mouseup", finishPosition);
        canvas.addEventListener("mousemove", draw);
    }

    function download() {
        let dnld = document.getElementById("download");
        let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        dnld.setAttribute("href", image);

    }

});