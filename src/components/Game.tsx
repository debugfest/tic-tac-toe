import { useState, useEffect, useCallback } from 'react';
import {
  Board as BoardType,
  Player,
  checkWinner,
  checkDraw,
  getBestMove,
  makeRandomMove,
  WINNING_COMBINATIONS,
} from '../utils/gameLogic';
import { Board } from './Board';
import { Status } from './Status';
import { RotateCcw, Users, Bot, Trophy } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { TournamentMode } from './TournamentMode';

type GameMode = 'pvp' | 'ai' | 'tournament';
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

  const handleSquareClick = useCallback(
    (index: number) => {
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
    },
    [board, currentPlayer, winner, isDraw, gameMode, getWinningLine]
  );

  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'O' && !winner && !isDraw) {
      const timer = setTimeout(() => {
        const aiMove =
          aiDifficulty === 'hard'
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
  }, [
    gameMode,
    currentPlayer,
    board,
    winner,
    isDraw,
    aiDifficulty,
    getWinningLine,
  ]);

  const switchGameMode = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  };

  // Render tournament mode
  if (gameMode === 'tournament') {
    return <TournamentMode />;
  }

  return (
    <div className="min-h-screen bg-background text-primary-text py-8 px-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold">Tic Tac Toe</h1>
          <p className="text-secondary-text">
            Challenge a friend or test your skills against AI
          </p>
        </div>

        <ThemeSwitcher />

        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => switchGameMode('pvp')}
            className={`
              px-6 py-3 rounded-lg font-semibold
              flex items-center gap-2
              transition-all duration-200
              ${
                gameMode === 'pvp'
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-surface text-primary-text border-2 border-board-border hover:border-primary'
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
              ${
                gameMode === 'ai'
                  ? 'bg-o-color text-white shadow-lg scale-105'
                  : 'bg-surface text-primary-text border-2 border-board-border hover:border-o-color'
              }
            `}
          >
            <Bot className="w-5 h-5" />
            Player vs AI
          </button>

          <button
            onClick={() => switchGameMode('tournament')}
            className={`
              px-6 py-3 rounded-lg font-semibold
              flex items-center gap-2
              transition-all duration-200
              ${
                gameMode === 'tournament'
                  ? 'bg-secondary text-white shadow-lg scale-105'
                  : 'bg-surface text-primary-text border-2 border-board-border hover:border-secondary'
              }
            `}
          >
            <Trophy className="w-5 h-5" />
            Tournament Mode
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
                ${
                  aiDifficulty === 'easy'
                    ? 'bg-green-600 text-white'
                    : 'bg-surface text-primary-text border border-board-border hover:border-green-400'
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
                ${
                  aiDifficulty === 'hard'
                    ? 'bg-orange-600 text-white'
                    : 'bg-surface text-primary-text border border-board-border hover:border-orange-400'
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
              bg-secondary text-white
              hover:bg-opacity-80
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
      </div>
    </div>
  );
};