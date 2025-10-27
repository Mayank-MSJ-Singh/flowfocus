// ------------------ Variables ------------------
let workSeconds = 25 * 60;
let breakSeconds = 5 * 60;
let totalSeconds = workSeconds;

let fadeIn: number | undefined;
let interval: number | undefined;
let idleTimeout: number | undefined;
let onBreak = false;
let isRunning = false;


const timeDisplay = document.getElementById('time') as HTMLElement;
const startBtn = document.getElementById('start') as HTMLButtonElement;
const stopBtn = document.getElementById('stop') as HTMLButtonElement;
const resetBtn = document.getElementById('reset') as HTMLButtonElement;
const timerEl = document.querySelector('.timer') as HTMLElement;

const presetButtons = document.querySelectorAll<HTMLButtonElement>('.preset');
const customWorkInput = document.getElementById('customWork') as HTMLInputElement;
const customBreakInput = document.getElementById('customBreak') as HTMLInputElement;
const customBtn = document.getElementById('customBtn') as HTMLButtonElement;

const rain = document.getElementById('rain') as HTMLAudioElement;
const rainImage = document.getElementById('rainImage') as HTMLImageElement | null;

// ------------------ Idle Background ------------------
function showIdleBackground() {
    if (isRunning && !onBreak && rainImage) {
        rainImage.classList.add('fade-in');
        rainImage.style.opacity = '1';
    }
}

function hideIdleBackground() {

    if (rainImage) {

        rainImage.classList.remove('fade-in');

        rainImage.style.opacity = '0'; // instantly hide

    }

    clearTimeout(idleTimeout);

    // restart idle timer only if running and not on break

    if (isRunning && !onBreak) {

        idleTimeout = window.setTimeout(showIdleBackground, 5000); // 5s idle delay

    }

}

function enableIdleTracking() {
    document.addEventListener('mousemove', hideIdleBackground);
    idleTimeout = window.setTimeout(showIdleBackground, 5000);
}

function disableIdleTracking() {
    document.removeEventListener('mousemove', hideIdleBackground);
    clearTimeout(idleTimeout);
    idleTimeout = undefined;
    if (rainImage) rainImage.style.opacity = '0'; // ensure hidden
}

// ------------------ Timer Core ------------------
function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    timeDisplay.textContent = formatTime(totalSeconds);
}

function startTimer() {
    if (interval) return; // prevent multiple intervals
    timerEl.classList.add('timer-active');
    isRunning = true;

    if (!onBreak) {
        rain.volume = 0;
        rain.play().catch(err => console.log("Autoplay blocked:", err));

        // fade-in sound
        const fadeDuration = 10; // seconds
        const fadeSteps = 20;
        const stepTime = (fadeDuration / fadeSteps) * 1000;
        const stepSize = 1 / fadeSteps;
        let currentVolume = 0;

        fadeIn = window.setInterval(() => {
            currentVolume += stepSize;
            if (currentVolume >= 1) {
                currentVolume = 1;
                clearInterval(fadeIn);
            }
            rain.volume = currentVolume;
        }, stepTime);

        enableIdleTracking(); // start idle detection
    }

    interval = window.setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateDisplay();
        } else {
            clearInterval(interval);
            interval = undefined;

            if (!onBreak) {
                // switch to break
                rain.pause();
                disableIdleTracking();
                onBreak = true;
                totalSeconds = breakSeconds;
                startTimer();
            } else {
                alert('Session complete!');
                onBreak = false;
                isRunning = false;
                totalSeconds = workSeconds;
                updateDisplay();
                timerEl.classList.remove('timer-active');
                disableIdleTracking();
            }
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
    clearInterval(fadeIn);
    interval = undefined;
    isRunning = false;
    disableIdleTracking();
    rain.pause();
    rain.currentTime = 0;
    timerEl.classList.remove('timer-active');
}

function resetTimer() {
    stopTimer();
    onBreak = false;
    totalSeconds = workSeconds;
    updateDisplay();
}

// ------------------ Preset Button Logic ------------------
presetButtons.forEach(button => {
    button.addEventListener('click', () => {
        workSeconds = parseInt(button.dataset.work!) * 60;
        breakSeconds = parseInt(button.dataset.break!) * 60;
        totalSeconds = workSeconds;
        onBreak = false;
        updateDisplay();
    });
});

// ------------------ Custom Session ------------------
customBtn.addEventListener('click', () => {
    const work = parseInt(customWorkInput.value);
    const brk = parseInt(customBreakInput.value);
    if (!isNaN(work) && !isNaN(brk)) {
        workSeconds = work * 60;
        breakSeconds = brk * 60;
        totalSeconds = workSeconds;
        onBreak = false;
        updateDisplay();
    } else {
        alert('Enter valid numbers for work and break');
    }
});

// ------------------ Button Events ------------------
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// ------------------ Init ------------------
updateDisplay();
