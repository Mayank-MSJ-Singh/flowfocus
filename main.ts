// ------------------ Variables ------------------
let workSeconds = 25 * 60;
let breakSeconds = 5 * 60;
let totalSeconds = workSeconds;
let interval: number | undefined;
let onBreak = false;

const timeDisplay = document.getElementById('time') as HTMLElement;
const startBtn = document.getElementById('start') as HTMLButtonElement;
const stopBtn = document.getElementById('stop') as HTMLButtonElement;
const resetBtn = document.getElementById('reset') as HTMLButtonElement;

const presetButtons = document.querySelectorAll<HTMLButtonElement>('.preset');
const customWorkInput = document.getElementById('customWork') as HTMLInputElement;
const customBreakInput = document.getElementById('customBreak') as HTMLInputElement;
const customBtn = document.getElementById('customBtn') as HTMLButtonElement;

// ------------------ Functions ------------------
function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
}

function updateDisplay() {
    timeDisplay.textContent = formatTime(totalSeconds);
}

function startTimer() {
    if (interval) return; // prevent multiple intervals
    interval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateDisplay();
        } else {
            clearInterval(interval);
            interval = undefined;
            if (!onBreak) {
                // Switch to break
                onBreak = true;
                totalSeconds = breakSeconds;
                startTimer();
            } else {
                alert('Session complete!');
                onBreak = false;
                totalSeconds = workSeconds;
                updateDisplay();
            }
        }
    }, 1000);
}

function stopTimer() {
    if (interval) {
        clearInterval(interval);
        interval = undefined;
    }
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
