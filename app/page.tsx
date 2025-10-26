"use client"; // important, enables React state/hooks

import { useState, useEffect, useRef } from "react";

export default function Home() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [running, setRunning] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = () => {
        if (timerRef.current) return;
        setRunning(true);
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    timerRef.current = null;
                    setRunning(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const pauseTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setRunning(false);
        }
    };

    const resetTimer = () => {
        pauseTimer();
        setTimeLeft(25 * 60);
    };

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="text-6xl mb-8">{formatTime(timeLeft)}</h1>
            <div className="space-x-4">
                <button
                    onClick={startTimer}
                    className="bg-red-500 px-6 py-2 rounded hover:bg-red-600"
                >
                    Start
                </button>
                <button
                    onClick={pauseTimer}
                    className="bg-yellow-500 px-6 py-2 rounded hover:bg-yellow-600"
                >
                    Pause
                </button>
                <button
                    onClick={resetTimer}
                    className="bg-green-500 px-6 py-2 rounded hover:bg-green-600"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}


const audioRef = useRef<HTMLAudioElement | null>(null);

const playSound = (file: string) => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    audioRef.current = new Audio(file);
    audioRef.current.loop = true;
    audioRef.current.play();
};

const stopSound = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
};
