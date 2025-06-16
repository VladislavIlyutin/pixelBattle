import React from 'react';
import "/src/game/PixelGrid.css"

interface ColorButtonProps {
    color: string;
    onClick: () => void;
    isLight: boolean;
}

const ColorButton: React.FC<ColorButtonProps> = ({ color, onClick, isLight }) => {
    return (
        <button
            onClick={onClick}
            className="color-button"
            style={{
                backgroundColor: color,
                color: isLight ? '#000' : '#fff',
            }}
        >
            Выбрать цвет
        </button>
    );
};

export default ColorButton;