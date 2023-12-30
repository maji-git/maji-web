const canvasConfi = document.querySelector("#canvas_confi")
const clockTickEasing = "linear"

canvasConfi.width = window.innerWidth
canvasConfi.height = window.innerHeight

const endDate = new Date('1/1/2024');

//let endDate = new Date();
//endDate.setSeconds(endDate.getSeconds() + 65);

function moveDigit(i, newNum) {
    const numDigit = document.querySelector(`#digit-${i}`)
    const nextDigit = document.querySelector(`#digit-${i} .next-digit`)
    const oldDigit = document.querySelector(`#digit-${i} .old-digit`)

    if (!numDigit) {
        return
    }

    if (nextDigit.textContent == newNum.toString()) {
        return
    }

    nextDigit.textContent = newNum

    numDigit.classList.add('digi-nummove')

    setTimeout(() => {
        oldDigit.textContent = newNum
        numDigit.classList.remove('digi-nummove')
    }, 500);
}

Number.prototype.pad = function (n) {
    return this.toString().padStart(n, '0');
}

let firstTick = 2
let oldSec = 0
let lastSeconds = false
let countdownDone = false

document.querySelector("#timezone").textContent = `Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`

setInterval(() => {
    const ct = new Date()
    const t = Date.parse(endDate) - Date.parse(new Date());
    const seconds = Math.floor((t / 1000) % 60);
    const minutes = Math.floor((t / 1000 / 60) % 60);
    const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    const days = Math.floor(t / (1000 * 60 * 60 * 24));

    const str = `${days.pad(2)}${hours.pad(2)}${minutes.pad(2)}${seconds.pad(2)}`

    let i = 0;

    if (!countdownDone) {
        for (const c of str) {
            moveDigit(i, parseInt(c))

            i++;
        }
    }

    if (!countdownDone) {
        if (str.charAt(0) == "0" && str.charAt(1) == "0") {
            document.querySelector(`#digit-0`).classList.add('num-gone')
            document.querySelector(`#digit-1`).classList.add('num-gone')
            document.querySelector(`#colon-1`).classList.add('num-gone')

            if (str.charAt(2) == "0" && str.charAt(3) == "0") {
                document.querySelector(`#digit-2`).classList.add('num-gone')
                document.querySelector(`#digit-3`).classList.add('num-gone')
                document.querySelector(`#colon-2`).classList.add('num-gone')

                if (str.charAt(4) == "0" && str.charAt(5) == "0") {
                    document.querySelector(`#digit-4`).classList.add('num-gone')
                    document.querySelector(`#digit-5`).classList.add('num-gone')
                    document.querySelector(`#colon-3`).classList.add('num-gone')
                    lastSeconds = true

                    if (str.charAt(6) == "0") {
                        document.querySelector(`#digit-6`).classList.add('num-gone')
                    }

                }
            }
        }
    }


    if (oldSec != seconds) {
        oldSec = seconds

        if (lastSeconds && countdownDone == false) {
            anime({
                targets: '#lastleft-arrows img',
                opacity: [0, 0.5, 0],
                delay: anime.stagger(25),
                duration: 700,
                easing: 'linear',
            });

            anime({
                targets: '#lastright-arrows img',
                opacity: [0, 0.5, 0],
                delay: anime.stagger(25, { direction: 'reverse' }),
                duration: 700,
                easing: 'linear',
            });
        }

        if (firstTick !== "none") {
            if (firstTick == 0) {
                document.querySelectorAll(`.digi-colon`).forEach((e) => {
                    e.classList.add("colon-animate")
                })
                firstTick = "none"
            } else {
                firstTick -= 1
            }
        }
    }

    if (days <= 0 && hours <= 0 && minutes <= 0 && seconds < 1 && countdownDone == false) {
        countdownDone = true

        let mConfetti = confetti.create(canvasConfi, {
            resize: true,
            useWorker: true
        });

        mConfetti({
            spread: 360,
            ticks: 200,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            shapes: ['star'],
            colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
            particleCount: 40,
            scalar: 1.2,
        });

        setTimeout(() => {
            document.querySelector(`#digit-4`).classList.remove('num-gone')
            document.querySelector(`#digit-5`).classList.remove('num-gone')
            document.querySelector(`#digit-6`).classList.remove('num-gone')
            document.querySelector(`#digit-7`).classList.remove('num-gone')

            document.querySelector(`#digit-4`).classList.add('num-active')
            document.querySelector(`#digit-5`).classList.add('num-active')
            document.querySelector(`#digit-6`).classList.add('num-active')
            document.querySelector(`#digit-7`).classList.add('num-active')
    
            moveDigit(4, "2")
            moveDigit(5, "0")
            moveDigit(6, "2")
            moveDigit(7, "4")
        }, 2000);

    }
}, 100);
