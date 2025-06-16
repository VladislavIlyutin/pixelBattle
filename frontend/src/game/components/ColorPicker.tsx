import React from 'react';
import { Sketch } from '@uiw/react-color';
import "/src/game/PixelGrid.css"

interface ColorPickerProps {
    selectedColor: string;
    showColorPicker: boolean;
    onClose: () => void;
    onChangeColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({selectedColor, showColorPicker, onClose, onChangeColor}) => {
    return (
        showColorPicker && (
            <div className="color-picker-popup">
                <Sketch
                    color={selectedColor}
                    onChange={(color) => onChangeColor(color.hex)}
                />
                <button className="color-picker-done-button" onClick={onClose}>
                    Готово
                </button>
            </div>
        )
    );
};

export default ColorPicker;