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
        activeUsers
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
    const [searchTerm, setSearchTerm] = useState('');

    const token = localStorage.getItem('token');
    const isGuest = !token;

    const filteredUsers = activeUsers.filter(user =>
        user.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const saveGridToImage = useCallback(() => {
        if (!config || grid.length === 0) return;

        const pixelSize = 10;
        const canvas = document.createElement('canvas');
        canvas.width = config.width * pixelSize;
        canvas.height = config.height * pixelSize;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                ctx.fillStyle = grid[y][x];
                ctx.fillRect(
                    x * pixelSize,
                    y * pixelSize,
                    pixelSize,
                    pixelSize
                );
            }
        }

        const link = document.createElement('a');
        link.download = `Pixel Battle.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }, [config, grid]);

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
            <div className="active-users-display">
                <input
                    type="text"
                    placeholder="Поиск пользователей"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="user-search-input"
                />
                <span className="users-title">Активные пользователи: {filteredUsers.length}</span>
                <ul className="user-list">
                    {filteredUsers.map((user, index) => (
                        <li key={index} className="user-item">
                            {user}
                        </li>
                    ))}
                </ul>
            </div>

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
                <button
                    className="save-image-button"
                    onClick={saveGridToImage}
                >
                    <img
                        src="/src/assets/image.png"
                        alt="Сохранить PNG"
                        className="save-icon"
                    />
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
