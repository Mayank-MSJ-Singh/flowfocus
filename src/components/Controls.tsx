type ControlsProps = {
    start: () => void
    stop: () => void
    reset: () => void
}

export default function Controls({ start, stop, reset }: ControlsProps) {
    return (
        <div className="controls">
            <button onClick={start}>Start</button>
            <button onClick={stop}>Stop</button>
            <button onClick={reset}>Reset</button>
        </div>
    )
}
