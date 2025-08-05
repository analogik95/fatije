import React, { useEffect, useState } from 'react';

interface FallingPiece {
    id: string;
    x: number;
    y: number;
    shape: number[][];
    color: string;
    letter: string;
}

const TetrisBackground: React.FC = () => {
    const [pieces, setPieces] = useState<FallingPiece[]>([]);
    const text = "FATIJE";

    // Classic Tetris colors
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];

    // Simple Tetris shapes
    const shapes = [
        [[1, 1, 1, 1]], // I-piece
        [[1, 1], [1, 1]], // O-piece
        [[0, 1, 0], [1, 1, 1]], // T-piece
        [[1, 1, 0], [0, 1, 1]], // S-piece
    ];

    const createPiece = (): FallingPiece => {
        return {
            id: Math.random().toString(36).substr(2, 9),
            x: Math.random() * (window.innerWidth - 100),
            y: -100,
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            letter: text[Math.floor(Math.random() * text.length)]
        };
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setPieces(prev => {
                const newPieces = prev
                    .map(piece => ({ ...piece, y: piece.y + 2 }))
                    .filter(piece => piece.y < window.innerHeight + 100);

                // Add new piece occasionally
                if (Math.random() < 0.1) {
                    newPieces.push(createPiece());
                }

                return newPieces;
            });
        }, 50);

        // Create initial pieces
        const initialPieces = Array.from({ length: 8 }, () => ({
            ...createPiece(),
            y: Math.random() * window.innerHeight
        }));
        setPieces(initialPieces);

        return () => clearInterval(interval);
    }, []);

    const renderPiece = (piece: FallingPiece) => {
        const blocks: React.ReactElement[] = [];
        const blockSize = 30;

        piece.shape.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell) {
                    blocks.push(
                        <div
                            key={`${piece.id}-${rowIndex}-${colIndex}`}
                            className="absolute border-2 border-black"
                            style={{
                                left: piece.x + colIndex * blockSize,
                                top: piece.y + rowIndex * blockSize,
                                width: blockSize,
                                height: blockSize,
                                backgroundColor: piece.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#000',
                                fontFamily: 'monospace',
                                boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.6), inset -2px -2px 4px rgba(0,0,0,0.6)',
                            }}
                        >
                            {piece.letter}
                        </div>
                    );
                }
            });
        });

        return blocks;
    };

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute inset-0 opacity-30">
                {pieces.map(piece => (
                    <div key={piece.id}>
                        {renderPiece(piece)}
                    </div>
                ))}
            </div>

            {/* Classic Tetris grid background */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `
            linear-gradient(#333 1px, transparent 1px),
            linear-gradient(90deg, #333 1px, transparent 1px)
          `,
                    backgroundSize: '30px 30px',
                }}
            />
        </div>
    );
};

export default TetrisBackground;
