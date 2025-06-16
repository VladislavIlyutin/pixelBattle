import React from 'react';
import Pixel from './Pixel';

interface PixelGridRenderer {
    grid: string[][];
    onPixelClick: (x: number, y: number) => void;
}

const PixelGridRenderer: React.FC<PixelGridRenderer> = ({ grid, onPixelClick }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${grid[0]?.length || 0}, 10px)` }}>
            {grid.map((row, y) =>
                row.map((color, x) => (
                    <Pixel key={`${x}-${y}`} x={x} y={y} color={color} onClick={onPixelClick} />
                ))
            )}
        </div>
    );
};

export default PixelGridRenderer;