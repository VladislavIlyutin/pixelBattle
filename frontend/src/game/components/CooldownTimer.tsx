import React from 'react';
import "/src/game/PixelGrid.css"

interface CooldownTimerProps {
    cooldown: number;
    isFlashing: boolean;
}

const CooldownTimer: React.FC<CooldownTimerProps> = ({ cooldown, isFlashing }) => {
    return (
        <div className={`cooldown-timer ${isFlashing ? 'flashing' : ''}`}>
            ⏱️ Следующее изменение через:
            <span className="cooldown-time">{cooldown}</span> сек.
        </div>
    );
};

export default CooldownTimer;