import React, { useCallback, useEffect, useRef, useState } from 'react';
import "/src/game/PixelGrid.css"
import CooldownTimer from '../components/CooldownTimer';
import ColorButton from '../components/ColorButton';
import ColorPicker from '../components/ColorPicker';
import { usePixelGrid } from '../hooks/usePixelGrid';
import { isLightColor } from '../utils/isLightColor';
import {AuthPromptModal} from "../components/AuthPromptModal.tsx";
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

    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const dragDistanceRef = useRef(0);
    const lastPositionRef = useRef({ x: 0, y: 0 });
    const isMouseDownRef = useRef(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const token = localStorage.getItem('token');
    const isGuest = !token;

    const handlePixelClickWrapper = useCallback((x: number, y: number) => {
        const wasDragging = Math.sqrt(
            dragDistanceRef.current ** 2 + dragDistanceRef.current ** 2
        ) > 5;

        if (wasDragging) return;

        if (isGuest) {
            setIsAuthModalOpen(true);
        } else {
            handlePixelClick(x, y);
        }
    }, [isGuest, handlePixelClick]);


    const handleWheel = useCallback((e: React.WheelEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const gridCenterX = (centerX - position.x) / scale;
        const gridCenterY = (centerY - position.y) / scale;

        const zoomIntensity = 0.1;

        const newScale = e.deltaY < 0
            ? Math.min(scale * (1 + zoomIntensity), 5)
            : Math.max(scale * (1 - zoomIntensity), 0.5);

        const newX = Math.round(centerX - gridCenterX * newScale);
        const newY = Math.round(centerY - gridCenterY * newScale);

        setScale(newScale);
        setPosition({ x: newX, y: newY });
    }, [scale, position]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button === 0) {
            isMouseDownRef.current = true;
            setIsDragging(true);

            dragStartRef.current = {
                x: e.clientX,
                y: e.clientY
            };

            lastPositionRef.current = { ...position };
            dragDistanceRef.current = 0;
        }
    }, [position]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isDragging) {
            const dx = e.clientX - dragStartRef.current.x;
            const dy = e.clientY - dragStartRef.current.y;

            dragDistanceRef.current = Math.sqrt(dx * dx + dy * dy);

            requestAnimationFrame(() => {
                setPosition({
                    x: Math.round(lastPositionRef.current.x + dx),
                    y: Math.round(lastPositionRef.current.y + dy)
                });
            });
        }
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
        }
    }, [isDragging]);

    const resetCamera = useCallback(() => {
        setScale(1);
        setPosition({ x: 250, y: 0 });
    }, []);
    useEffect(() => {
        resetCamera();
    }, [resetCamera]);


    useEffect(() => {
        const handleResize = () => {
            resetCamera();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [resetCamera]);

    const handleSliderChange = useCallback((newScale: number) => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const gridCenterX = (centerX - position.x) / scale;
        const gridCenterY = (centerY - position.y) / scale;

        const newX = Math.round(centerX - gridCenterX * newScale);
        const newY = Math.round(centerY - gridCenterY * newScale);

        setScale(newScale);
        setPosition({ x: newX, y: newY });
    }, [scale, position]);

    if (!config || grid.length === 0) {
        return <div>Загрузка поля...</div>;
    }
    return (
        <div className="pixel-grid">
            <CooldownTimer cooldown={cooldown} isFlashing={isFlashing} />
            <AuthPromptModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
            <div
                ref={containerRef}
                className="grid-container"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
                <div
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transformOrigin: '0 0'
                    }}
                >
                    <PixelGridRenderer
                        grid={grid}
                        onPixelClick={handlePixelClickWrapper}
                    />
                </div>
            </div>

            <div className="zoom-slider-container">
                <div className="zoom-slider">
                    <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={scale}
                        onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                        aria-label="Масштаб"
                    /></div>
                <button
                    className="reset-camera-button"
                    onClick={resetCamera}
                    title="Сбросить вид"
                >
                    Сброс
                </button>
            </div>

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

export default React.memo(PixelGrid);
