type TimerProps = { timeLeft: number }

export default function Timer({ timeLeft }: TimerProps) {
    const mins = Math.floor(timeLeft / 60)
    const secs = timeLeft % 60
    return (
        <span id="time">
            {`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`}
        </span>
    )
}
