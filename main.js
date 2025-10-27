// ------------------ Variables ------------------
let workSeconds = 25 * 60;
let breakSeconds = 5 * 60;
let totalSeconds = workSeconds;
let fadeIn;
let interval;
let onBreak = false;
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const timerEl = document.querySelector('.timer');
const presetButtons = document.querySelectorAll('.preset');
const customWorkInput = document.getElementById('customWork');
const customBreakInput = document.getElementById('customBreak');
const customBtn = document.getElementById('customBtn');
const rain = document.getElementById('rain');
// ------------------ Functions ------------------
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
function updateDisplay() {
    timeDisplay.textContent = formatTime(totalSeconds);
}
function startTimer() {
    if (interval)
        return; // prevent multiple intervals
    timerEl.classList.add('timer-active');
    // ✅ Only play rain during work time
    if (!onBreak) {
        rain.volume = 0;
        rain.play().catch(err => console.log("Autoplay blocked:", err));
        const fadeDuration = 10; // seconds
        const fadeSteps = 20; // how many times we adjust volume
        const stepTime = (fadeDuration / fadeSteps) * 1000; // ms per step
        const stepSize = 1 / fadeSteps;
        let currentVolume = 0;
        fadeIn = setInterval(() => {
            currentVolume += stepSize;
            if (currentVolume >= 1) {
                currentVolume = 1;
                clearInterval(fadeIn);
            }
            rain.volume = currentVolume;
        }, stepTime);
    }
    interval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateDisplay();
        }
        else {
            clearInterval(interval);
            interval = undefined;
            if (!onBreak) {
                // Switch to break
                rain.pause(); // stop rain
                onBreak = true;
                totalSeconds = breakSeconds;
                startTimer();
            }
            else {
                alert('Session complete!');
                onBreak = false;
                totalSeconds = workSeconds;
                updateDisplay();
                timerEl.classList.remove('timer-active');
            }
        }
    }, 1000);
}
function stopTimer() {
    clearInterval(interval);
    clearInterval(fadeIn);
    rain.pause();
    rain.currentTime = 0;
    interval = undefined;
    timerEl.classList.remove('timer-active');
}
function resetTimer() {
    rain.pause();
    rain.currentTime = 0;
    stopTimer();
    onBreak = false;
    totalSeconds = workSeconds;
    updateDisplay();
}
// ------------------ Preset Button Logic ------------------
presetButtons.forEach(button => {
    button.addEventListener('click', () => {
        workSeconds = parseInt(button.dataset.work) * 60;
        breakSeconds = parseInt(button.dataset.break) * 60;
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
    }
    else {
        alert('Enter valid numbers for work and break');
    }
});
// ------------------ Button Events ------------------
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);
// ------------------ Init ------------------
updateDisplay();
export {};
//# sourceMappingURL=main.js.map