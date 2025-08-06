import React, { useEffect, useState, useRef } from 'react';

interface LetterPiece {
    shape: number[][];
    color: string;
    x: number;
    y: number;
    targetY: number;
    letter: string;
    isPlaced: boolean;
}

interface GridCell {
    filled: boolean;
    color: string;
    letter: string;
}

const TetrisBackground: React.FC = () => {
    const GRID_WIDTH = 28;
    const GRID_HEIGHT = 20;
    const BLOCK_SIZE = 20;

    const [grid, setGrid] = useState<GridCell[][]>(() =>
        Array(GRID_HEIGHT).fill(null).map(() =>
            Array(GRID_WIDTH).fill(null).map(() => ({ filled: false, color: '', letter: '' }))
        )
    );
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [animationPhase, setAnimationPhase] = useState<'spelling' | 'celebration' | 'briefcase' | 'character' | 'falling' | 'restarting'>('spelling');
    const [fallingPiece, setFallingPiece] = useState<LetterPiece | null>(null);
    const [celebrationActive, setCelebrationActive] = useState(false);
    const [briefcasePos, setBriefcasePos] = useState({ x: 0, y: 0, visible: false });
    const [characterPos, setCharacterPos] = useState({ x: -100, y: 0, visible: false, direction: 'right' });
    const gameRef = useRef<HTMLDivElement>(null);

    // Letter sequence and colors
    const letterSequence = ['F', 'A', 'T', 'I', 'J', 'E'];
    const letterColors = [
        'linear-gradient(45deg, #ff6b6b, #ff4757)', // F - Red
        'linear-gradient(45deg, #4ecdc4, #00d2d3)', // A - Teal
        'linear-gradient(45deg, #45b7d1, #3742fa)', // T - Blue
        'linear-gradient(45deg, #f9ca24, #f0932b)', // I - Yellow
        'linear-gradient(45deg, #f0932b, #eb4d4b)', // J - Orange
        'linear-gradient(45deg, #eb4d4b, #c44569)'  // E - Pink
    ];

    // Letter shapes for clear display
    const letterShapes = {
        F: [
            [1, 1, 1, 1],
            [1, 0, 0, 0],
            [1, 1, 1, 0],
            [1, 0, 0, 0],
            [1, 0, 0, 0]
        ],
        A: [
            [0, 1, 1, 0],
            [1, 0, 0, 1],
            [1, 0, 0, 1],
            [1, 1, 1, 1],
            [1, 0, 0, 1]
        ],
        T: [
            [1, 1, 1, 1, 1],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0]
        ],
        I: [
            [1, 1, 1],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 1]
        ],
        J: [
            [0, 0, 0, 1],
            [0, 0, 0, 1],
            [0, 0, 0, 1],
            [1, 0, 0, 1],
            [1, 1, 1, 1]
        ],
        E: [
            [1, 1, 1, 1],
            [1, 0, 0, 0],
            [1, 1, 1, 0],
            [1, 0, 0, 0],
            [1, 1, 1, 1]
        ]
    };

    // Centered positions for each letter - fixed positioning
    const letterPositions = [
        { x: 1, y: 7 },   // F
        { x: 6, y: 7 },   // A  
        { x: 11, y: 7 },  // T
        { x: 17, y: 7 },  // I
        { x: 21, y: 7 },  // J
        { x: 26, y: 7 }   // E - fits in 28 width grid
    ];

    // Animation cycle
    useEffect(() => {
        const startAnimation = async () => {
            // Reset everything
            setAnimationPhase('spelling');
            setCurrentLetterIndex(0);
            setCelebrationActive(false);
            setGrid(Array(GRID_HEIGHT).fill(null).map(() =>
                Array(GRID_WIDTH).fill(null).map(() => ({ filled: false, color: '', letter: '' }))
            ));

            // Spell out FATIJE
            for (let i = 0; i < letterSequence.length; i++) {
                await animateLetter(i);
                await wait(800);
            }

            // Celebration
            setAnimationPhase('celebration');
            setCelebrationActive(true);
            await wait(3000);
            setCelebrationActive(false);

            // Briefcase falls
            setAnimationPhase('briefcase');
            await animateBriefcase();

            // Character comes to collect
            setAnimationPhase('character');
            await animateCharacter();

            // Fall apart
            setAnimationPhase('falling');
            await fallApart();

            // Wait before restart
            await wait(2000);

            // Restart
            startAnimation();
        };

        startAnimation();
    }, []);

    const animateLetter = async (letterIndex: number) => {
        const letter = letterSequence[letterIndex];
        const shape = letterShapes[letter as keyof typeof letterShapes];
        const position = letterPositions[letterIndex];
        const color = letterColors[letterIndex];

        setCurrentLetterIndex(letterIndex);

        // Create falling piece
        const piece: LetterPiece = {
            shape,
            color,
            x: position.x,
            y: 0,
            targetY: position.y,
            letter,
            isPlaced: false
        };

        // Animate fall with rotation and movement
        return new Promise<void>((resolve) => {
            let currentY = 0;
            let rotations = 0;
            let movements = 0;
            const maxRotations = Math.floor(Math.random() * 2) + 1;
            const maxMovements = Math.floor(Math.random() * 3) + 1;

            setFallingPiece({ ...piece, y: currentY });

            const fallInterval = setInterval(() => {
                // Random rotation during fall
                if (rotations < maxRotations && Math.random() < 0.3) {
                    rotatePiece(piece);
                    rotations++;
                }

                // Random horizontal movement
                if (movements < maxMovements && Math.random() < 0.2) {
                    const direction = Math.random() < 0.5 ? -1 : 1;
                    const newX = piece.x + direction;
                    if (newX >= 0 && newX + getShapeWidth(piece.shape) <= GRID_WIDTH) {
                        piece.x = newX;
                        movements++;
                    }
                }

                currentY++;

                if (currentY >= piece.targetY) {
                    // Place piece at final position
                    placePiece({ ...piece, x: position.x, y: position.y }); // Reset to target position
                    setFallingPiece(null);
                    clearInterval(fallInterval);
                    resolve();
                } else {
                    setFallingPiece({ ...piece, y: currentY });
                }
            }, 150);
        });
    };

    const rotatePiece = (piece: LetterPiece) => {
        const rotated: number[][] = [];
        const rows = piece.shape.length;
        const cols = piece.shape[0].length;

        for (let i = 0; i < cols; i++) {
            rotated[i] = [];
            for (let j = 0; j < rows; j++) {
                rotated[i][j] = piece.shape[rows - 1 - j][i];
            }
        }

        // Check if rotation fits
        if (piece.x + rotated[0].length <= GRID_WIDTH) {
            piece.shape = rotated;
        }
    };

    const animateBriefcase = async () => {
        const briefcaseX = Math.floor(GRID_WIDTH / 2) - 1;
        const briefcaseY = GRID_HEIGHT - 3;

        setBriefcasePos({ x: briefcaseX, y: -2, visible: true });

        // Animate briefcase falling
        return new Promise<void>((resolve) => {
            let currentY = -2;
            const fallInterval = setInterval(() => {
                currentY++;
                setBriefcasePos(prev => ({ ...prev, y: currentY }));

                if (currentY >= briefcaseY) {
                    clearInterval(fallInterval);
                    resolve();
                }
            }, 100);
        });
    };

    const animateCharacter = async () => {
        const direction = Math.random() < 0.5 ? 'left' : 'right';
        const startX = direction === 'left' ? -100 : GRID_WIDTH * BLOCK_SIZE + 50;
        const endX = briefcasePos.x * BLOCK_SIZE;
        const characterY = (GRID_HEIGHT - 2) * BLOCK_SIZE;

        setCharacterPos({
            x: startX,
            y: characterY,
            visible: true,
            direction
        });

        // Character walks to briefcase
        return new Promise<void>((resolve) => {
            const walkInterval = setInterval(() => {
                setCharacterPos(prev => {
                    const speed = 4;
                    let newX = prev.x;

                    if (direction === 'left') {
                        newX = Math.min(prev.x + speed, endX);
                    } else {
                        newX = Math.max(prev.x - speed, endX);
                    }

                    // When character reaches briefcase
                    if (Math.abs(newX - endX) < 10) {
                        setBriefcasePos(prev => ({ ...prev, visible: false }));

                        // Character walks away
                        setTimeout(() => {
                            const walkAwayInterval = setInterval(() => {
                                setCharacterPos(prev => {
                                    const exitX = direction === 'left' ? -100 : GRID_WIDTH * BLOCK_SIZE + 50;
                                    let awayX = prev.x;

                                    if (direction === 'left') {
                                        awayX = Math.max(prev.x - speed, exitX);
                                    } else {
                                        awayX = Math.min(prev.x + speed, exitX);
                                    }

                                    if (Math.abs(awayX - exitX) < 10) {
                                        clearInterval(walkAwayInterval);
                                        setCharacterPos(prev => ({ ...prev, visible: false }));
                                        resolve();
                                    }

                                    return { ...prev, x: awayX };
                                });
                            }, 50);
                        }, 1000);

                        clearInterval(walkInterval);
                    }

                    return { ...prev, x: newX };
                });
            }, 50);
        });
    };

    const getShapeWidth = (shape: number[][]) => {
        return shape[0].length;
    };

    const placePiece = (piece: LetterPiece) => {
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => [...row]);

            for (let row = 0; row < piece.shape.length; row++) {
                for (let col = 0; col < piece.shape[row].length; col++) {
                    if (piece.shape[row][col]) {
                        const x = piece.x + col;
                        const y = piece.y + row;

                        if (y >= 0 && y < GRID_HEIGHT && x >= 0 && x < GRID_WIDTH) {
                            newGrid[y][x] = {
                                filled: true,
                                color: piece.color,
                                letter: piece.letter
                            };
                        }
                    }
                }
            }

            return newGrid;
        });
    };

    const fallApart = async () => {
        const blocks = gameRef.current?.querySelectorAll('.tetris-block');
        if (!blocks) return;

        // Make blocks fall with staggered timing
        blocks.forEach((block, index) => {
            setTimeout(() => {
                (block as HTMLElement).style.animation = 'blockFall 3s ease-in forwards';
            }, index * 50);
        });

        await wait(4000);

        // Clear grid after all blocks have fallen
        setGrid(Array(GRID_HEIGHT).fill(null).map(() =>
            Array(GRID_WIDTH).fill(null).map(() => ({ filled: false, color: '', letter: '' }))
        ));
    };

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const createFirework = () => {
        if (!gameRef.current) return;

        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.position = 'absolute';
        firework.style.width = '20px';
        firework.style.height = '20px';
        firework.style.borderRadius = '50%';
        firework.style.left = (Math.random() * (GRID_WIDTH * BLOCK_SIZE)) + 'px';
        firework.style.top = (Math.random() * (GRID_HEIGHT * BLOCK_SIZE)) + 'px';
        firework.style.background = letterColors[Math.floor(Math.random() * letterColors.length)];
        firework.style.animation = 'firework 2s ease-out forwards';

        gameRef.current.appendChild(firework);

        setTimeout(() => {
            if (firework.parentNode) {
                firework.parentNode.removeChild(firework);
            }
        }, 2000);
    };

    // Create fireworks during celebration
    useEffect(() => {
        if (celebrationActive) {
            const fireworkInterval = setInterval(() => {
                createFirework();
            }, 150);

            return () => clearInterval(fireworkInterval);
        }
    }, [celebrationActive]);

    const renderGrid = () => {
        const blocks: React.ReactElement[] = [];

        // Render placed blocks
        for (let row = 0; row < GRID_HEIGHT; row++) {
            for (let col = 0; col < GRID_WIDTH; col++) {
                const cell = grid[row][col];
                if (cell.filled) {
                    blocks.push(
                        <div
                            key={`${row}-${col}`}
                            className={`tetris-block absolute border-2 border-white border-opacity-40 rounded ${celebrationActive ? 'animate-pulse' : ''}`}
                            style={{
                                left: col * BLOCK_SIZE,
                                top: row * BLOCK_SIZE,
                                width: BLOCK_SIZE,
                                height: BLOCK_SIZE,
                                background: cell.color,
                                boxShadow: `
                  inset 0 0 8px rgba(255, 255, 255, 0.3),
                  0 0 ${celebrationActive ? '15px' : '8px'} rgba(0, 0, 0, 0.5)
                `,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                color: '#000',
                                fontFamily: 'monospace',
                                transition: 'all 0.3s ease'
                            }}
                        >
                        </div>
                    );
                }
            }
        }

        // Render falling piece
        if (fallingPiece) {
            for (let row = 0; row < fallingPiece.shape.length; row++) {
                for (let col = 0; col < fallingPiece.shape[row].length; col++) {
                    if (fallingPiece.shape[row][col]) {
                        const x = fallingPiece.x + col;
                        const y = fallingPiece.y + row;

                        if (y >= 0) {
                            blocks.push(
                                <div
                                    key={`falling-${row}-${col}`}
                                    className="absolute border-2 border-white border-opacity-40 rounded animate-bounce"
                                    style={{
                                        left: x * BLOCK_SIZE,
                                        top: y * BLOCK_SIZE,
                                        width: BLOCK_SIZE,
                                        height: BLOCK_SIZE,
                                        background: fallingPiece.color,
                                        boxShadow: `
                      inset 0 0 8px rgba(255, 255, 255, 0.4),
                      0 0 15px rgba(0, 0, 0, 0.6)
                    `,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                        color: '#000',
                                        fontFamily: 'monospace',
                                        zIndex: 10
                                    }}
                                >
                                </div>
                            );
                        }
                    }
                }
            }
        }

        return blocks;
    };

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <style>{`
        @keyframes firework {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.5) rotate(180deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(3) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes blockFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(800px) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes celebrationPulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.1);
            filter: brightness(1.3);
          }
        }
      `}</style>

            {/* Multiple game boards for full coverage */}
            <div className="absolute inset-0 opacity-25">
                {Array.from({ length: 4 }, (_, i) => (
                    <div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${(i % 2) * 50}%`,
                            top: `${Math.floor(i / 2) * 50}%`,
                            transform: `scale(${0.8 + Math.random() * 0.4})`,
                        }}
                    >
                        <div
                            ref={i === 0 ? gameRef : null}
                            className="relative bg-black bg-opacity-30 border border-cyan-500 rounded"
                            style={{
                                width: GRID_WIDTH * BLOCK_SIZE,
                                height: GRID_HEIGHT * BLOCK_SIZE,
                                boxShadow: celebrationActive ? '0 0 30px rgba(0, 255, 255, 0.8)' : '0 0 10px rgba(0, 255, 255, 0.3)'
                            }}
                        >
                            {renderGrid()}

                            {/* Briefcase */}
                            {briefcasePos.visible && (
                                <div
                                    className="absolute"
                                    style={{
                                        left: briefcasePos.x * BLOCK_SIZE,
                                        top: briefcasePos.y * BLOCK_SIZE,
                                        width: BLOCK_SIZE * 2,
                                        height: BLOCK_SIZE,
                                        background: 'linear-gradient(45deg, #8B4513, #A0522D)',
                                        border: '2px solid #654321',
                                        borderRadius: '4px',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                                        zIndex: 20,
                                    }}
                                >
                                    {/* Briefcase handle */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: '12px',
                                            height: '8px',
                                            background: '#444',
                                            borderRadius: '4px 4px 0 0',
                                            border: '1px solid #222'
                                        }}
                                    />
                                    {/* Briefcase lock */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '6px',
                                            height: '6px',
                                            background: '#FFD700',
                                            borderRadius: '50%',
                                            border: '1px solid #B8860B'
                                        }}
                                    />
                                </div>
                            )}

                            {/* Character */}
                            {characterPos.visible && (
                                <div
                                    className="absolute"
                                    style={{
                                        left: characterPos.x,
                                        top: characterPos.y,
                                        width: '40px',
                                        height: '60px',
                                        zIndex: 25,
                                        transform: characterPos.direction === 'right' ? 'scaleX(-1)' : 'none'
                                    }}
                                >
                                    {/* Character body */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: '20px',
                                            height: '35px',
                                            background: 'linear-gradient(45deg, #4169E1, #1E90FF)',
                                            borderRadius: '10px 10px 5px 5px',
                                            border: '1px solid #000080'
                                        }}
                                    />
                                    {/* Character head */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: '16px',
                                            height: '16px',
                                            background: '#FFDBAC',
                                            borderRadius: '50%',
                                            border: '1px solid #DEB887'
                                        }}
                                    />
                                    {/* Character arms */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '18px',
                                            left: '8px',
                                            width: '4px',
                                            height: '15px',
                                            background: '#FFDBAC',
                                            borderRadius: '2px'
                                        }}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '18px',
                                            right: '8px',
                                            width: '4px',
                                            height: '15px',
                                            background: '#FFDBAC',
                                            borderRadius: '2px'
                                        }}
                                    />
                                    {/* Character legs */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: '12px',
                                            width: '3px',
                                            height: '12px',
                                            background: '#000080',
                                            borderRadius: '0 0 2px 2px'
                                        }}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: '12px',
                                            width: '3px',
                                            height: '12px',
                                            background: '#000080',
                                            borderRadius: '0 0 2px 2px'
                                        }}
                                    />
                                </div>
                            )}

                            {/* Grid overlay */}
                            <div
                                className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: `
                    linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px)
                  `,
                                    backgroundSize: `${BLOCK_SIZE}px ${BLOCK_SIZE}px`,
                                }}
                            />

                            {/* Celebration text */}
                            {celebrationActive && (
                                <div
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-cyan-400 font-bold text-xl animate-pulse"
                                    style={{
                                        textShadow: '0 0 20px rgba(0, 255, 255, 1)',
                                        zIndex: 200
                                    }}
                                >
                                    FATIJE!
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TetrisBackground;
