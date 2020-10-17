document.addEventListener("DOMContentLoaded", () => {

    //#region spinner loader
    loader();

    function loader() {
        setTimeout(function () {
            document.getElementById('spinner').style.visibility = "hidden";
            document.getElementById('content').style.visibility = "visible";
        }, 3000);
    }

    //#endregion

    //#region count-down
    let countDownDate = new Date("Oct 25, 2020 15:37:25").getTime();

    let aux = setInterval(function () {
        let now = new Date().getTime();
        let difference = countDownDate - now;

        let days = Math.floor(difference / (1000 * 60 * 60 * 24));
        let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerHTML = "- Only " + days + "d " + hours + "hs " +
            minutes + "ms " + seconds + "s " + " to see it in big screens!";

        if (difference < 0) {
            clearInterval(aux);
            document.getElementById("countdown").innerHTML = "- Available in the nearest cinema!";
        }
    }, 1000);

    //#endregion

    //#region parallax-effect
    let the = document.querySelector('#sign_the');
    let simpsons = document.querySelector('#sign_simpsons');
    let family = document.querySelector('#family');
    let cloud1 = document.querySelector('#cloud1');
    let cloud2 = document.querySelector('#cloud2');
    let cloud3 = document.querySelector('#cloud3');
    let cloud4 = document.querySelector('#cloud4');
    let characters = document.querySelector('#character');
    let characterstext = document.querySelector('#characters-text');

    window.addEventListener('scroll', function () {
        var valueY = window.scrollY;

        cloud1.style.top = valueY + 70 + 'px';

        cloud2.style.top = valueY + 150 + 'px';

        cloud3.style.top = valueY + 70 + 'px';

        cloud4.style.top = valueY + 150 + 'px';

        the.style.left = valueY * 0.7 + 'px';

        simpsons.style.left = -valueY * 1.7 + 'px';

        family.style.top = -valueY + 140 + 'px';

        characters.style.top = -valueY + 840 + 'px';

        characters.style.left = valueY * 0.4 + 'px';

        characterstext.style.top = -valueY + 840 + 'px';

    })

    //#endregion

    //#region acordeon calendar-events
    let lis = document.querySelectorAll(".accordeon li");

    lis.forEach(li => {
        li.addEventListener("click", () => {
            li.nextElementSibling.classList.toggle("visible");
        });
    });

    //#endregion

});