import { useState, useEffect, useRef, useCallback } from "react"
import Timer from "./components/Timer"
import Controls from "./components/Controls"
import SessionSelector from "./components/SessionSelector"
import Background from "./components/Background"
import type { BackgroundHandles } from "./components/Background";

function App() {
    const [workSeconds, setWorkSeconds] = useState(25 * 60)
    const [breakSeconds, setBreakSeconds] = useState(5 * 60)
    const [timeLeft, setTimeLeft] = useState(workSeconds)
    const [isRunning, setIsRunning] = useState(false)
    const [onBreak, setOnBreak] = useState(false)

    const intervalRef = useRef<number | null>(null)
    const backgroundRef = useRef<BackgroundHandles>(null);

    useEffect(() => {
        if (!isRunning) return

        intervalRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    if (!onBreak) {
                        // Switch to break
                        backgroundRef.current?.stopAudioFadeIn();
                        backgroundRef.current?.disableIdleTracking();
                        setOnBreak(true);
                        return breakSeconds;
                    } else {
                        alert('Session complete!');
                        setOnBreak(false);
                        setIsRunning(false);
                        return workSeconds;
                    }
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, onBreak, breakSeconds, workSeconds]);

    const startTimer = useCallback(() => {
        if (isRunning) return;
        setIsRunning(true);

        if (!onBreak) {
            backgroundRef.current?.startAudioFadeIn();
            backgroundRef.current?.enableIdleTracking();
        }
    }, [isRunning, onBreak]);

    const stopTimer = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
        backgroundRef.current?.disableIdleTracking();
        backgroundRef.current?.stopAudioFadeIn();
    }, []);

    const resetTimer = useCallback(() => {
        stopTimer();
        setOnBreak(false);
        setTimeLeft(workSeconds);
    }, [stopTimer, workSeconds]);

    useEffect(() => {
        setTimeLeft(workSeconds);
    }, [workSeconds]);

    return (
        <div id="app">
            <div className={`timer ${isRunning ? 'timer-active' : ''}`}>
                <Timer timeLeft={timeLeft} />
                <SessionSelector
                    onPreset={(work, brk) => {
                        setWorkSeconds(work * 60);
                        setBreakSeconds(brk * 60);
                        setTimeLeft(work * 60);
                        setOnBreak(false);
                        stopTimer(); // Stop timer when preset changes
                    }}
                />
            </div>
            <Controls start={startTimer} stop={stopTimer} reset={resetTimer} />
            <Background ref={backgroundRef} isRunning={isRunning} onBreak={onBreak} />
        </div>
    );
}

export default App
