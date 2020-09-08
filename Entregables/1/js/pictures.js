"use strict";
window.addEventListener("load", () => {
    let canvas = document.querySelector("#canvas");
    let ctx = canvas.getContext("2d");
    let input = document.querySelector('.input1');

    //   let filtro1 = document.querySelector('#sepia');

    //   filtro1.addEventListener("click", sepia);

    input.onchange = e => {

        // getting a hold of the file reference
        let file = e.target.files[0];

        // setting up the reader
        let reader = new FileReader();
        reader.readAsDataURL(file); // this is reading as data url

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            let content = readerEvent.target.result; // this is the content!

            let image = new Image();
            image.crossOrigin = 'Anonymous';

            image.src = content;

            image.onload = function () {
                let scale = Math.min(canvas.width / this.width, canvas.height / this.height);

                //               let imageAspectRatio = (1.0 * this.height) / this.width;
                // let imageScaledWidth = canvas.width;
                // let imageScaledHeight = canvas.width * imageAspectRatio;

                // draw image on canvas
                ctx.drawImage(this, 0, 0, this.width * scale, this.height * scale);

            }
        }
    }

});