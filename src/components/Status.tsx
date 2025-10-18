import { Player } from '../utils/gameLogic';
import { Trophy, Users } from 'lucide-react';

interface StatusProps {
  winner: Player;
  isDraw: boolean;
  currentPlayer: Player;
  gameMode: 'pvp' | 'ai';
}

export const Status = ({ winner, isDraw, currentPlayer, gameMode }: StatusProps) => {
  const getStatusMessage = () => {
    if (winner) {
      return (
        <div className="flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6 text-secondary" />
          <span className="text-2xl font-bold">
            Player <span className={winner === 'X' ? 'text-x-color' : 'text-o-color'}>{winner}</span> Wins!
          </span>
        </div>
      );
    }

    if (isDraw) {
      return (
        <div className="flex items-center justify-center gap-2">
          <Users className="w-6 h-6 text-secondary-text" />
          <span className="text-2xl font-bold text-secondary-text">It's a Draw!</span>
        </div>
      );
    }

    return (
      <div className="text-xl font-semibold text-primary-text">
        Current Player:{' '}
        <span className={currentPlayer === 'X' ? 'text-x-color' : 'text-o-color'}>
          {currentPlayer}
        </span>
        {gameMode === 'ai' && currentPlayer === 'O' && (
          <span className="text-sm text-secondary-text ml-2">(AI)</span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-surface rounded-xl shadow-md border-2 border-board-border">
      {getStatusMessage()}
    </div>
  );
};
