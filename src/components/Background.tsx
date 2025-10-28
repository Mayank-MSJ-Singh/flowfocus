import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";

type BackgroundHandles = {
    enableIdleTracking: () => void;
    disableIdleTracking: () => void;
    startAudioFadeIn: () => void;
    stopAudioFadeIn: () => void;
};

type BackgroundProps = {
    // isRunning and onBreak are no longer needed as props for idle tracking logic within Background.tsx
};

const Background = forwardRef<BackgroundHandles, BackgroundProps>((props, ref) => {
    const rainAudioRef = useRef<HTMLAudioElement>(null);
    const rainImageRef = useRef<HTMLImageElement>(null);
    const idleTimeoutRef = useRef<number | null>(null);
    const fadeInRef = useRef<number | null>(null);

    const showIdleBackground = useCallback(() => {
        console.log("showIdleBackground called. rainImageRef.current:", rainImageRef.current);
        if (rainImageRef.current) {
            rainImageRef.current.classList.add('fade-in');
            rainImageRef.current.style.opacity = '1';
        }
    }, []);

    const hideIdleBackground = useCallback(() => {
        console.log("hideIdleBackground called. rainImageRef.current:", rainImageRef.current);
        if (rainImageRef.current) {
            rainImageRef.current.classList.remove('fade-in');
            rainImageRef.current.style.opacity = '0';
        }
        if (idleTimeoutRef.current) {
            clearTimeout(idleTimeoutRef.current);
        }
        // The decision to restart idle timer is now handled by App.tsx calling enableIdleTracking
    }, []);

    const enableIdleTracking = useCallback(() => {
        console.log("enableIdleTracking called");
        document.addEventListener('mousemove', hideIdleBackground);
        idleTimeoutRef.current = window.setTimeout(showIdleBackground, 5000);
    }, [hideIdleBackground, showIdleBackground]);

    const disableIdleTracking = useCallback(() => {
        console.log("disableIdleTracking called");
        document.removeEventListener('mousemove', hideIdleBackground);
        if (idleTimeoutRef.current) {
            clearTimeout(idleTimeoutRef.current);
            idleTimeoutRef.current = null;
        }
        if (rainImageRef.current) rainImageRef.current.style.opacity = '0';
    }, [hideIdleBackground]);

    useImperativeHandle(ref, () => ({
        enableIdleTracking,
        disableIdleTracking,
        startAudioFadeIn,
        stopAudioFadeIn,
    }));

    const startAudioFadeIn = useCallback(() => {
        if (rainAudioRef.current) {
            rainAudioRef.current.volume = 0;
            rainAudioRef.current.play().catch(err => console.log("Autoplay blocked:", err));

            const fadeDuration = 10; // seconds
            const fadeSteps = 20;
            const stepTime = (fadeDuration / fadeSteps) * 1000;
            const stepSize = 1 / fadeSteps;
            let currentVolume = 0;

            fadeInRef.current = window.setInterval(() => {
                currentVolume += stepSize;
                if (rainAudioRef.current) {
                    if (currentVolume >= 1) {
                        currentVolume = 1;
                        if (fadeInRef.current) clearInterval(fadeInRef.current);
                    }
                    rainAudioRef.current.volume = currentVolume;
                }
            }, stepTime);
        }
    }, []);

    const stopAudioFadeIn = useCallback(() => {
        if (fadeInRef.current) clearInterval(fadeInRef.current);
        if (rainAudioRef.current) {
            rainAudioRef.current.pause();
            rainAudioRef.current.currentTime = 0;
        }
    }, []);

    return (
        <>
            <div className="sounds">
                <audio id="rain" src="/public/sounds/rain.mp3" loop ref={rainAudioRef}></audio>
            </div>
            <div className="images">
                <img id="rainImage" src="/public/images/rain.jpg" alt="Rain background" ref={rainImageRef} />
            </div>
        </>
    );
});

export default Background;

