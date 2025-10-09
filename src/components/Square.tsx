import { Player } from '../utils/gameLogic';

interface SquareProps {
  value: Player;
  onClick: () => void;
  isWinningSquare?: boolean;
}

export const Square = ({ value, onClick, isWinningSquare = false }: SquareProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full h-full aspect-square
        flex items-center justify-center
        text-5xl font-bold
        bg-white
        border-2 border-slate-300
        rounded-lg
        transition-all duration-200
        hover:bg-slate-50 hover:border-slate-400
        active:scale-95
        disabled:cursor-not-allowed
        ${isWinningSquare ? 'bg-green-100 border-green-400' : ''}
        ${value === 'X' ? 'text-blue-600' : 'text-rose-600'}
      `}
      disabled={value !== null}
      aria-label={`Square ${value || 'empty'}`}
    >
      {value}
    </button>
  );
};
