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
          <Trophy className="w-6 h-6 text-yellow-500" />
          <span className="text-2xl font-bold">
            Player <span className={winner === 'X' ? 'text-blue-600' : 'text-rose-600'}>{winner}</span> Wins!
          </span>
        </div>
      );
    }

    if (isDraw) {
      return (
        <div className="flex items-center justify-center gap-2">
          <Users className="w-6 h-6 text-slate-500" />
          <span className="text-2xl font-bold text-slate-600">It's a Draw!</span>
        </div>
      );
    }

    return (
      <div className="text-xl font-semibold text-slate-700">
        Current Player:{' '}
        <span className={currentPlayer === 'X' ? 'text-blue-600' : 'text-rose-600'}>
          {currentPlayer}
        </span>
        {gameMode === 'ai' && currentPlayer === 'O' && (
          <span className="text-sm text-slate-500 ml-2">(AI)</span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border-2 border-slate-200">
      {getStatusMessage()}
    </div>
  );
};
