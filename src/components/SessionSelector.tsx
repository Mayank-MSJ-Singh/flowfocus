import { useState } from 'react';

type Props = {
    onPreset: (work: number, brk: number) => void;
};

export default function SessionSelector({ onPreset }: Props) {
    const [customWork, setCustomWork] = useState('');
    const [customBreak, setCustomBreak] = useState('');

    const handleCustomSet = () => {
        const work = parseInt(customWork);
        const brk = parseInt(customBreak);
        if (!isNaN(work) && !isNaN(brk)) {
            onPreset(work, brk);
        } else {
            alert('Enter valid numbers for work and break');
        }
    };

    return (
        <div className="session-selector">
            <button onClick={() => onPreset(25, 5)} className="preset">25+5</button>
            <button onClick={() => onPreset(45, 15)} className="preset">45+15</button>

            <div className="custom-session">
                <div className="inputs-row">
                    <input
                        type="number"
                        id="customWork"
                        min="1"
                        placeholder="Work (min)"
                        value={customWork}
                        onChange={(e) => setCustomWork(e.target.value)}
                    />
                    <input
                        type="number"
                        id="customBreak"
                        min="1"
                        placeholder="Break (min)"
                        value={customBreak}
                        onChange={(e) => setCustomBreak(e.target.value)}
                    />
                </div>
                <button id="customBtn" onClick={handleCustomSet}>Set Custom</button>
            </div>
        </div>
    );
}
