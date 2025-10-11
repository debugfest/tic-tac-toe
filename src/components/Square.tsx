import { Player } from '../utils/gameLogic';

interface SquareProps {
  value: Player;
  onClick: () => void;
  isWinningSquare?: boolean;
}

export const Square = ({ value, onClick, isWinningSquare = false }: SquareProps) => {
  const textColor = value === 'X' ? 'text-x-color' : 'text-o-color';

  return (
    <button
      onClick={onClick}
      className={`
        w-full h-full aspect-square
        flex items-center justify-center
        text-5xl font-bold
        bg-surface
        border-2 border-board-border
        rounded-lg
        transition-all duration-200
        hover:bg-opacity-80
        active:scale-95
        disabled:cursor-not-allowed
        ${isWinningSquare ? 'bg-secondary' : ''}
        ${textColor}
      `}
      disabled={value !== null}
      aria-label={`Square ${value || 'empty'}`}
    >
      {value}
    </button>
  );
};