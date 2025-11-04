// Animación del título

const message = "Gestor de Tareas Colaborativo los chicos malotes";
let msgCount = 0;
let blinkCount = 0;
let blinkFlg = 0;
let timer1, timer2;
const messageLabel = document.getElementById("messageLabel");

function textFunc() {
    if (messageLabel) {
        messageLabel.textContent = message.substring(0, msgCount);
        
        if (msgCount === message.length) {
            clearInterval(timer1);
            timer2 = setInterval(blinkFunc, 200);
        } else {
            msgCount++;
        }
    }
}


// Iniciar la animación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (messageLabel) {
        timer1 = setInterval(textFunc, 50);
    }
});
//================================================