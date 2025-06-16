import { useEffect, useState } from 'react';
import axios from 'axios';

interface Pixel {
    x: number;
    y: number;
    color: string;
}

interface GridConfig {
    width: number;
    height: number;
}

export const usePixelGrid = () => {
    const [grid, setGrid] = useState<string[][]>([]);
    const [config, setConfig] = useState<GridConfig | null>(null);

    const [selectedColor, setSelectedColor] = useState('#000000');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [cooldown, setCooldown] = useState<number>(0);
    const [isFlashing, setIsFlashing] = useState<boolean>(false);

    const token = localStorage.getItem('token');


    const getUsernameFromToken = (token: string): string => {
        try {
            const payload = token.split('.')[1];
            const decodedPayload = atob(payload);
            return JSON.parse(decodedPayload).sub;
        } catch (error) {
            console.error('Ошибка декодирования токена:', error);
            return "unknown";
        }
    };

    useEffect(() => {
        if (!token) return;

        const fetchInitialCooldown = async () => {
            try {
                const username = getUsernameFromToken(token);

                const response = await axios.get<{ remainingSeconds: number }>(
                    'http://localhost:8080/api/game/cooldown',
                    {
                        params: { username },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setCooldown(response.data.remainingSeconds);
            } catch (error) {
                console.error('Ошибка загрузки кулдауна:', error);
            }
        };

        fetchInitialCooldown();

        const interval = setInterval(async () => {
            try {
                const username = getUsernameFromToken(token);

                const response = await axios.get<{ remainingSeconds: number }>(
                    'http://localhost:8080/api/game/cooldown',
                    {
                        params: { username },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setCooldown(response.data.remainingSeconds);
            } catch (error) {
                console.error('Ошибка обновления кулдауна:', error);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                if (!token) {
                    console.error("Токен не найден");
                    return;
                }

                const response = await axios.get<{ width: number, height: number }>(
                    'http://localhost:8080/api/game/grid/config',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setConfig(response.data);
            } catch (error) {
                console.error('Ошибка загрузки конфигурации', error);
            }
        };
        fetchConfig();
    }, [token]);

    useEffect(() => {
        if (!config || !token) return;

        const fetchData = async () => {
            try {
                const response = await axios.get<Pixel[]>('http://localhost:8080/api/game/grid', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const pixels = response.data;
                const { width, height } = config;

                const newGrid: string[][] = Array.from({ length: height }, () =>
                    Array.from({ length: width }, () => '#FFFFFF')
                );

                pixels.forEach(pixel => {
                    if (
                        pixel.x >= 0 && pixel.x < width &&
                        pixel.y >= 0 && pixel.y < height
                    ) {
                        newGrid[pixel.y][pixel.x] = pixel.color;
                    }
                });

                setGrid(newGrid);
            } catch (error) {
                console.error('Ошибка загрузки поля:', error);
            }
        };

        fetchData();
    }, [config, token]);

    const handlePixelClick = async (x: number, y: number) => {
        if (cooldown > 0) {
            setIsFlashing(true);
            setTimeout(() => setIsFlashing(false), 500);
            return;
        }

        const updatedGrid = [...grid];
        updatedGrid[y][x] = selectedColor;
        setGrid(updatedGrid);

        try {
            const payload = { x, y, color: selectedColor };
            await axios.post(
                'http://localhost:8080/api/game/change-color',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
        } catch (error) {
            console.error('Не удалось сохранить изменения:', error);
            updatedGrid[y][x] = grid[y][x]; // Откатываем изменение
            setGrid(updatedGrid);
        }
    };

    return {
        grid,
        config,
        cooldown,
        selectedColor,
        showColorPicker,
        handlePixelClick,
        setShowColorPicker,
        setSelectedColor,
        isFlashing,
        setIsFlashing
    };
};