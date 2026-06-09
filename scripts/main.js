const btnStart = document.getElementById('btnStart');

btnStart.addEventListener('click', () => {
    btnStartHandler();
});

// handle click btn start
const btnStartHandler = (event) => {
    // btnStart add class .spinning-element
    btnStart.innerText = "HBD";
    btnStart.classList.add('spinning-element');
    
    setTimeout(() => {
        btnStart.style.left = "10px"
        btnStart.style.bottom = "10px"
    }, 1500);
    
    const audio = new Audio('assets/hbd-tuyu.mp3');
    audio.play();
}