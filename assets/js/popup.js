/* #extensao */

// pega lista das popups
var pops = document.getElementsByClassName('overlay');

// fechar popup quando clicar algo fora dela
window.onclick = function(event) {
    for (var i = 0, len = pops.length ; i < len ; i++) {
        if (event.target == pops[i]) {
            //window.location.replace('#portfolio');
            window.location.replace('#null');
        }
    }
}