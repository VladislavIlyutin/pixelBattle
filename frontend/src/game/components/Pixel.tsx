import React from 'react';
import "/src/game/PixelGrid.css"

interface PixelProps {
    x: number;
    y: number;
    color: string;
    onClick: (x: number, y: number) => void;
}

const Pixel: React.FC<PixelProps> = ({ x, y, color, onClick }) => {
    return (
        <div
            className="pixel"
            style={{ backgroundColor: color }}
            onClick={() => onClick(x, y)}
        />
    );
};

export default Pixel;