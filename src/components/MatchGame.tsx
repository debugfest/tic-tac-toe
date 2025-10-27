import { useState, useEffect, useCallback } from 'react';
import { Match, SeriesResult, GameResult, Player } from '../types/tournament';
import { Board as BoardType, checkWinner, checkDraw } from '../utils/gameLogic';
import { Board } from './Board';
import { Status } from './Status';
import { RotateCcw, Trophy, Users, ArrowLeft } from 'lucide-react';

interface MatchGameProps {
  match: Match;
  seriesLength: 3 | 5;
  onSeriesComplete: (seriesResult: SeriesResult) => void;
  onBack: () => void;
}

export const MatchGame = ({ match, seriesLength, onSeriesComplete, onBack }: MatchGameProps) => {
  const [board, setBoard] = useState<BoardType>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<'X' | 'O' | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [currentGame, setCurrentGame] = useState(1);
  const [gameStartTime, setGameStartTime] = useState<Date>(new Date());

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setIsDraw(false);
    setWinningLine([]);
    setGameStartTime(new Date());
  }, []);

  const handleSquareClick = useCallback(
    (index: number) => {
      if (board[index] || winner || isDraw) return;

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
    [board, currentPlayer, winner, isDraw]
  );

  const getWinningLine = (board: BoardType): number[] => {
    const WINNING_COMBINATIONS = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return combination;
      }
    }
    return [];
  };

  const completeGame = useCallback(() => {
    const gameEndTime = new Date();
    const duration = Math.floor((gameEndTime.getTime() - gameStartTime.getTime()) / 1000);
    const moves = board.filter(cell => cell !== null).length;

    const gameResult: GameResult = {
      playerX: match.player1,
      playerO: match.player2,
      winner: winner || 'draw',
      moves,
      duration,
      timestamp: gameEndTime,
    };

    const updatedHistory = [...gameHistory, gameResult];
    setGameHistory(updatedHistory);

    // Check if series is complete
    const player1Wins = updatedHistory.filter(game => game.winner === 'X').length;
    const player2Wins = updatedHistory.filter(game => game.winner === 'O').length;
    const draws = updatedHistory.filter(game => game.winner === 'draw').length;

    const neededWins = Math.ceil(seriesLength / 2);
    
    if (player1Wins >= neededWins || player2Wins >= neededWins || updatedHistory.length >= seriesLength) {
      // Series complete
      const seriesWinner = player1Wins > player2Wins ? match.player1 : 
                          player2Wins > player1Wins ? match.player2 : null;

      const seriesResult: SeriesResult = {
        playerX: match.player1,
        playerO: match.player2,
        games: updatedHistory,
        winner: seriesWinner,
        seriesLength,
        completedAt: new Date(),
      };

      onSeriesComplete(seriesResult);
    } else {
      // Continue to next game
      setCurrentGame(currentGame + 1);
      resetGame();
    }
  }, [board, winner, gameHistory, gameStartTime, match, seriesLength, currentGame, onSeriesComplete, resetGame]);

  const getSeriesStatus = () => {
    const player1Wins = gameHistory.filter(game => game.winner === 'X').length;
    const player2Wins = gameHistory.filter(game => game.winner === 'O').length;
    const draws = gameHistory.filter(game => game.winner === 'draw').length;

    return {
      player1Wins,
      player2Wins,
      draws,
      neededWins: Math.ceil(seriesLength / 2),
    };
  };

  const seriesStatus = getSeriesStatus();

  return (
    <div className="min-h-screen bg-background text-primary-text py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-secondary-text hover:text-primary-text transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Tournament
          </button>
          
          <h1 className="text-4xl font-bold">Match: {match.player1.name} vs {match.player2.name}</h1>
          <p className="text-secondary-text">Best of {seriesLength} • Game {currentGame}</p>
        </div>

        {/* Series Score */}
        <div className="bg-surface rounded-xl p-6 shadow-md border-2 border-board-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-x-color">{match.player1.name}</div>
              <div className="text-4xl font-bold text-x-color">{seriesStatus.player1Wins}</div>
              <div className="text-sm text-secondary-text">Wins</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-secondary-text">Series</div>
              <div className="text-2xl font-bold">{gameHistory.length} / {seriesLength}</div>
              <div className="text-sm text-secondary-text">
                {seriesStatus.draws} Draw{seriesStatus.draws !== 1 ? 's' : ''}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-o-color">{match.player2.name}</div>
              <div className="text-4xl font-bold text-o-color">{seriesStatus.player2Wins}</div>
              <div className="text-sm text-secondary-text">Wins</div>
            </div>
          </div>
        </div>

        {/* Game Status */}
        <Status
          winner={winner}
          isDraw={isDraw}
          currentPlayer={currentPlayer}
          gameMode="pvp"
        />

        {/* Game Board */}
        <Board
          board={board}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
        />

        {/* Game Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={resetGame}
            className="px-6 py-3 rounded-lg font-semibold bg-secondary text-white hover:bg-opacity-80 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset Game
          </button>
          
          {(winner || isDraw) && (
            <button
              onClick={completeGame}
              className="px-6 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-opacity-80 transition-colors flex items-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Complete Game
            </button>
          )}
        </div>

        {/* Game History */}
        {gameHistory.length > 0 && (
          <div className="bg-surface rounded-xl p-6 shadow-md border-2 border-board-border">
            <h3 className="text-xl font-bold mb-4">Game History</h3>
            <div className="space-y-2">
              {gameHistory.map((game, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-background rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">Game {index + 1}</span>
                    <span className="text-secondary-text">
                      {game.moves} moves • {game.duration}s
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {game.winner === 'draw' ? (
                      <span className="text-secondary-text">Draw</span>
                    ) : (
                      <span className={game.winner === 'X' ? 'text-x-color font-bold' : 'text-o-color font-bold'}>
                        {game.winner === 'X' ? match.player1.name : match.player2.name} Wins
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
