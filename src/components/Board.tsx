import { Board as BoardType } from '../utils/gameLogic';
import { Square } from './Square';

interface BoardProps {
  board: BoardType;
  onSquareClick: (index: number) => void;
  winningLine?: number[];
}

export const Board = ({ board, onSquareClick, winningLine = [] }: BoardProps) => {
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-md mx-auto p-4">
      {board.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => onSquareClick(index)}
          isWinningSquare={winningLine.includes(index)}
        />
      ))}
    </div>
  );
};
