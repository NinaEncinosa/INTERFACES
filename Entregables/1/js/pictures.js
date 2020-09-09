"use strict";
window.addEventListener("load", () => {
    //Variables
    let canvas = document.querySelector("#canvas");
    let ctx = canvas.getContext("2d");
    let downloader = document.querySelector("#download");
    let input = document.querySelector(".input1");


    let sepia = document.querySelector("#flt-sepia");
    let negativo = document.querySelector("#flt-negativo");
    let binario = document.querySelector("#flt-binario");

    //EventListeners
    downloader.addEventListener("click", download);
    sepia.addEventListener("click", applySepiaFilter);
    negativo.addEventListener("click", applyNegativeFilter);
    binario.addEventListener("click", applyBinaryFilter);


    //Funciones

    function download() {
        let dnld = document.getElementById("download");
        let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        dnld.setAttribute("href", image);

    }

    function applySepiaFilter() {
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < imageData.height; y++) {
            for (let x = 0; x < imageData.width; x++) {
                let index = (x + imageData.width * y) * 4;
                let red = 0.393 * imageData.data[index + 0] + 0.769 * imageData.data[index + 1] + 0.189 * imageData.data[index + 2];
                if (red > 255) red = 255;
                let green = 0.349 * imageData.data[index + 0] + 0.686 * imageData.data[index + 1] + 0.168 * imageData.data[index + 2];
                if (green > 255) green = 255;
                let blue = 0.272 * imageData.data[index + 0] + 0.534 * imageData.data[index + 1] + 0.131 * imageData.data[index + 2];
                if (blue > 255) blue = 255;

                imageData.data[index + 0] = red;
                imageData.data[index + 1] = green;
                imageData.data[index + 2] = blue;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }


    function applyNegativeFilter() {
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                let index = (x + y * imageData.width) * 4;
                imageData.data[index + 0] = 255 - imageData.data[index + 0];
                imageData.data[index + 1] = 255 - imageData.data[index + 1];
                imageData.data[index + 2] = 255 - imageData.data[index + 2];
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    function applyBinaryFilter() {
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                let index = (x + y * imageData.width) * 4;
                let pixel = imageData.data[index + 0] + imageData.data[index + 1] + imageData.data[index + 2];
                if (pixel > 381) { //uso 381 ((255 + 255 + 255) / 2) como valor frontera entre B y N.
                    imageData.data[index + 0] = 255;
                    imageData.data[index + 1] = 255;
                    imageData.data[index + 2] = 255;
                } else {
                    imageData.data[index + 0] = 0;
                    imageData.data[index + 1] = 0;
                    imageData.data[index + 2] = 0;
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }






    //Cargo la imagen desde el ordenador
    input.onchange = (e) => {
        // getting a hold of the file reference
        let file = e.target.files[0];

        // setting up the reader
        let reader = new FileReader();
        reader.readAsDataURL(file); // this is reading as data url

        // here we tell the reader what to do when it's done reading...
        reader.onload = (readerEvent) => {
            let content = readerEvent.target.result; // this is the content!

            let image = new Image();
            image.crossOrigin = "Anonymous";

            image.src = content;

            image.onload = function () {
                let scale = Math.min(
                    canvas.width / this.width,
                    canvas.height / this.height
                );
                ctx.drawImage(this, 0, 0, this.width * scale, this.height * scale);
            };
        };
    };

});