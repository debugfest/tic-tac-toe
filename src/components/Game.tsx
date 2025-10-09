import { useState, useEffect, useCallback } from 'react';
import { Board as BoardType, Player, checkWinner, checkDraw, getBestMove, makeRandomMove, WINNING_COMBINATIONS } from '../utils/gameLogic';
import { Board } from './Board';
import { Status } from './Status';
import { RotateCcw, Users, Bot } from 'lucide-react';

type GameMode = 'pvp' | 'ai';
type AIDifficulty = 'easy' | 'hard';

export const Game = () => {
  const [board, setBoard] = useState<BoardType>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [aiDifficulty, setAIDifficulty] = useState<AIDifficulty>('hard');
  const [winningLine, setWinningLine] = useState<number[]>([]);

  const getWinningLine = useCallback((board: BoardType): number[] => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return combination;
      }
    }
    return [];
  }, []);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setIsDraw(false);
    setWinningLine([]);
  }, []);

  const handleSquareClick = useCallback((index: number) => {
    if (board[index] || winner || isDraw) return;
    if (gameMode === 'ai' && currentPlayer === 'O') return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setWinningLine(getWinningLine(newBoard));
      return;
    }

    if (checkDraw(newBoard)) {
      setIsDraw(true);
      return;
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  }, [board, currentPlayer, winner, isDraw, gameMode, getWinningLine]);

  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'O' && !winner && !isDraw) {
      const timer = setTimeout(() => {
        const aiMove = aiDifficulty === 'hard'
          ? getBestMove([...board], 'O')
          : makeRandomMove([...board]);

        const newBoard = [...board];
        newBoard[aiMove] = 'O';
        setBoard(newBoard);

        const gameWinner = checkWinner(newBoard);
        if (gameWinner) {
          setWinner(gameWinner);
          setWinningLine(getWinningLine(newBoard));
          return;
        }

        if (checkDraw(newBoard)) {
          setIsDraw(true);
          return;
        }

        setCurrentPlayer('X');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [gameMode, currentPlayer, board, winner, isDraw, aiDifficulty, getWinningLine]);

  const switchGameMode = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-slate-800">Tic Tac Toe</h1>
          <p className="text-slate-600">Challenge a friend or test your skills against AI</p>
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => switchGameMode('pvp')}
            className={`
              px-6 py-3 rounded-lg font-semibold
              flex items-center gap-2
              transition-all duration-200
              ${gameMode === 'pvp'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-blue-400'
              }
            `}
          >
            <Users className="w-5 h-5" />
            Player vs Player
          </button>

          <button
            onClick={() => switchGameMode('ai')}
            className={`
              px-6 py-3 rounded-lg font-semibold
              flex items-center gap-2
              transition-all duration-200
              ${gameMode === 'ai'
                ? 'bg-rose-600 text-white shadow-lg scale-105'
                : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-rose-400'
              }
            `}
          >
            <Bot className="w-5 h-5" />
            Player vs AI
          </button>
        </div>

        {gameMode === 'ai' && (
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setAIDifficulty('easy');
                resetGame();
              }}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm
                transition-all duration-200
                ${aiDifficulty === 'easy'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:border-green-400'
                }
              `}
            >
              Easy AI
            </button>
            <button
              onClick={() => {
                setAIDifficulty('hard');
                resetGame();
              }}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm
                transition-all duration-200
                ${aiDifficulty === 'hard'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:border-orange-400'
                }
              `}
            >
              Hard AI (Minimax)
            </button>
          </div>
        )}

        <Status
          winner={winner}
          isDraw={isDraw}
          currentPlayer={currentPlayer}
          gameMode={gameMode}
        />

        <Board
          board={board}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
        />

        <div className="flex justify-center">
          <button
            onClick={resetGame}
            className="
              px-8 py-3 rounded-lg font-semibold
              bg-slate-700 text-white
              hover:bg-slate-800
              active:scale-95
              transition-all duration-200
              flex items-center gap-2
              shadow-md
            "
          >
            <RotateCcw className="w-5 h-5" />
            New Game
          </button>
        </div>

        <div className="bg-slate-800 text-slate-100 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold border-b border-slate-600 pb-2">
            Open Source Enhancement Ideas
          </h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>Themes:</strong> Add dark mode, color schemes, and custom board styles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>Animations:</strong> Smooth transitions for X/O placement and winning celebrations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>Multiplayer:</strong> Real-time online play using WebSockets or Supabase Realtime</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>Leaderboard:</strong> Track wins/losses using Supabase database</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>Sound Effects:</strong> Audio feedback for moves and game outcomes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong>Tournament Mode:</strong> Best of 3/5 series with score tracking</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
