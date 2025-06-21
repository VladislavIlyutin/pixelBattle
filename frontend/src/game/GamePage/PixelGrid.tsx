import React from 'react';
import "/src/game/PixelGrid.css"
import CooldownTimer from '../components/CooldownTimer';
import ColorButton from '../components/ColorButton';
import ColorPicker from '../components/ColorPicker';
import { usePixelGrid } from '../hooks/usePixelGrid';
import { isLightColor } from '../utils/isLightColor';
import PixelGridRenderer from "../components/PixelGridRender.tsx";

const PixelGrid: React.FC = () => {
    const {
        grid,
        config,
        cooldown,
        selectedColor,
        showColorPicker,
        handlePixelClick,
        setShowColorPicker,
        setSelectedColor,
        isFlashing,
    } = usePixelGrid();

    const token = localStorage.getItem('token');
    const isGuest = !token; // Определяем, гость это или нет

    if (!config || grid.length === 0) {
        return <div>Загрузка поля...</div>;
    }
    return (
        <div className="pixel-grid">
            <CooldownTimer cooldown={cooldown} isFlashing={isFlashing} />
            {/* Передаём isGuest */}
            <PixelGridRenderer
                grid={grid}
                onPixelClick={handlePixelClick}
                isGuest={isGuest}
            />
            <ColorButton
                color={selectedColor}
                onClick={() => setShowColorPicker(prev => !prev)}
                isLight={isLightColor(selectedColor)}
            />
            <ColorPicker
                selectedColor={selectedColor}
                showColorPicker={showColorPicker}
                onClose={() => setShowColorPicker(false)}
                onChangeColor={setSelectedColor}
            />
        </div>
    );
};

export default PixelGrid;