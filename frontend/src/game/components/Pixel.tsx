import React, { useState } from 'react';
import { AuthPromptModal } from './AuthPromptModal.tsx';
import "/src/game/PixelGrid.css";

interface PixelProps {
    x: number;
    y: number;
    color: string;
    onClick: (x: number, y: number) => void;
    isGuest: boolean;
}

const Pixel: React.FC<PixelProps> = ({ x, y, color, onClick, isGuest }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        if (isGuest) {
            setIsModalOpen(true);
        } else {
            onClick(x, y);
        }
    };

    return (
        <>
            <div
                className="pixel"
                style={{
                    backgroundColor: color,
                    cursor: isGuest ? 'not-allowed' : 'pointer'
                }}
                onClick={handleClick}
            />
            {isGuest && (
                <AuthPromptModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default Pixel;