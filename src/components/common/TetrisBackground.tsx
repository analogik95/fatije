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
  const BLOCK_SIZE = 30;
  
  const [grid, setGrid] = useState<GridCell[][]>(() => 
    Array(GRID_HEIGHT).fill(null).map(() => 
      Array(GRID_WIDTH).fill(null).map(() => ({ filled: false, color: '', letter: '' }))
    )
  );
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<'spelling' | 'celebration' | 'falling' | 'restarting'>('spelling');
  const [fallingPiece, setFallingPiece] = useState<LetterPiece | null>(null);
  const [celebrationActive, setCelebrationActive] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);

  // Letter sequence and colors - EXACT from your HTML
  const letterSequence = ['F', 'A', 'T', 'I', 'J', 'E'];
  const letterColors = [
    'linear-gradient(45deg, #ff6b6b, #ff4757)', // F - Red
    'linear-gradient(45deg, #4ecdc4, #00d2d3)', // A - Teal
    'linear-gradient(45deg, #45b7d1, #3742fa)', // T - Blue
    'linear-gradient(45deg, #f9ca24, #f0932b)', // I - Yellow
    'linear-gradient(45deg, #f0932b, #eb4d4b)', // J - Orange
    'linear-gradient(45deg, #eb4d4b, #c44569)'  // E - Pink
  ];

  // Letter shapes - EXACT from your HTML
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

  // Centered positions - FIXED to center FATIJE properly in middle of screen
  const letterPositions = [
    { x: 1, y: 7 },   // F
    { x: 6, y: 7 },   // A  
    { x: 11, y: 7 },  // T
    { x: 17, y: 7 },  // I
    { x: 21, y: 7 },  // J
    { x: 26, y: 7 }   // E
  ];

  // Main animation cycle - EXACTLY like your HTML
  useEffect(() => {
    const startAnimation = async () => {
      // Reset everything
      setAnimationPhase('spelling');
      setCurrentLetterIndex(0);
      setCelebrationActive(false);
      setGrid(Array(GRID_HEIGHT).fill(null).map(() => 
        Array(GRID_WIDTH).fill(null).map(() => ({ filled: false, color: '', letter: '' }))
      ));
      
      // Spell out FATIJE letter by letter
      for (let i = 0; i < letterSequence.length; i++) {
        await animateLetter(i);
        await wait(800);
      }
      
      // Celebration phase
      setAnimationPhase('celebration');
      setCelebrationActive(true);
      await wait(3000);
      setCelebrationActive(false);
      
      // Fall apart phase - wait for ALL blocks to completely disappear
      setAnimationPhase('falling');
      await fallApart();
      await wait(4000); // Wait for all blocks to completely fall and disappear
      
      // Restart only after ALL blocks have completely disappeared
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
          // Place piece at EXACT final position - reset to target
          placePiece({ ...piece, x: position.x, y: position.y });
          setFallingPiece(null);
          clearInterval(fallInterval);
          resolve();
        } else {
          setFallingPiece({ ...piece, y: currentY });
        }
      }, 200);
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
    
    if (piece.x + rotated[0].length <= GRID_WIDTH) {
      piece.shape = rotated;
    }
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
    
    // Make ALL blocks fall with staggered timing - EXACTLY like your HTML
    blocks.forEach((block, index) => {
      setTimeout(() => {
        (block as HTMLElement).style.animation = 'blockFall 3s ease-in forwards';
      }, index * 100);
    });
    
    // Wait for ALL blocks to completely disappear
    await wait(4000);
    
    // Clear grid only after ALL blocks have fallen and completely disappeared
    setGrid(Array(GRID_HEIGHT).fill(null).map(() => 
      Array(GRID_WIDTH).fill(null).map(() => ({ filled: false, color: '', letter: '' }))
    ));
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const createFirework = () => {
    if (!gameRef.current) return;
    
    const firework = document.createElement('div');
    firework.style.position = 'absolute';
    firework.style.width = '20px';
    firework.style.height = '20px';
    firework.style.borderRadius = '50%';
    firework.style.left = (Math.random() * (GRID_WIDTH * BLOCK_SIZE)) + 'px';
    firework.style.top = (Math.random() * (GRID_HEIGHT * BLOCK_SIZE)) + 'px';
    firework.style.background = letterColors[Math.floor(Math.random() * letterColors.length)];
    firework.style.animation = 'firework 2s ease-out forwards';
    firework.style.zIndex = '999';
    
    gameRef.current.appendChild(firework);
    
    setTimeout(() => {
      if (firework.parentNode) {
        firework.parentNode.removeChild(firework);
      }
    }, 2000);
  };

  // Create fireworks during celebration - EXACTLY like your HTML
  useEffect(() => {
    if (celebrationActive) {
      const fireworkInterval = setInterval(() => {
        createFirework();
      }, 150);
      
      return () => clearInterval(fireworkInterval);
    }
  }, [celebrationActive]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
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
        
        @keyframes celebrationFade {
          0%, 100% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.5); 
          }
          20%, 80% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1); 
          }
        }
        
        @keyframes fall {
          from {
            transform: translateY(-60px);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
      
      {/* SINGLE CENTERED GAME BOARD - EXACTLY like your HTML */}
      <div
        ref={gameRef}
        className="relative bg-black bg-opacity-90 border-4 border-cyan-400 rounded-lg"
        style={{
          width: GRID_WIDTH * BLOCK_SIZE,
          height: GRID_HEIGHT * BLOCK_SIZE,
          boxShadow: celebrationActive 
            ? '0 0 60px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.5)' 
            : '0 0 30px rgba(0, 255, 255, 0.5)'
        }}
      >
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${BLOCK_SIZE}px ${BLOCK_SIZE}px`,
          }}
        />

        {/* Render placed blocks */}
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (!cell.filled) return null;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`tetris-block absolute border-2 border-white border-opacity-40 rounded ${celebrationActive ? 'animate-pulse' : ''}`}
                style={{
                  left: colIndex * BLOCK_SIZE,
                  top: rowIndex * BLOCK_SIZE,
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
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#000',
                  fontFamily: 'monospace',
                  transition: 'all 0.3s ease'
                }}
              >
                {cell.letter}
              </div>
            );
          })
        )}

        {/* Render falling piece */}
        {fallingPiece && fallingPiece.shape.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (!cell) return null;
            const x = fallingPiece.x + colIndex;
            const y = fallingPiece.y + rowIndex;
            
            if (y < 0) return null;
            
            return (
              <div
                key={`falling-${rowIndex}-${colIndex}`}
                className="absolute border-2 border-white border-opacity-40 rounded"
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
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#000',
                  fontFamily: 'monospace',
                  zIndex: 10,
                  animation: 'fall 1s ease-out'
                }}
              >
                {fallingPiece.letter}
              </div>
            );
          })
        )}

        {/* Celebration text - EXACTLY like your HTML */}
        {celebrationActive && (
          <div
            className="absolute top-1/2 left-1/2 text-cyan-400 font-bold text-4xl"
            style={{
              textShadow: '0 0 30px rgba(0, 255, 255, 1)',
              zIndex: 200,
              animation: 'celebrationFade 3s ease-in-out'
            }}
          >
            FATIJE!
          </div>
        )}
      </div>
    </div>
  );
};

export default TetrisBackground;
