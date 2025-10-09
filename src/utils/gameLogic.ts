export type Player = 'X' | 'O' | null;
export type Board = Player[];

export const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const checkWinner = (board: Board): Player => {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

export const checkDraw = (board: Board): boolean => {
  return board.every((cell) => cell !== null) && !checkWinner(board);
};

export const getEmptyCells = (board: Board): number[] => {
  return board.reduce((acc, cell, index) => {
    if (cell === null) acc.push(index);
    return acc;
  }, [] as number[]);
};

export const makeRandomMove = (board: Board): number => {
  const emptyCells = getEmptyCells(board);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

export const minimax = (
  board: Board,
  depth: number,
  isMaximizing: boolean,
  player: Player,
  opponent: Player
): number => {
  const winner = checkWinner(board);

  if (winner === player) return 10 - depth;
  if (winner === opponent) return depth - 10;
  if (checkDraw(board)) return 0;

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const index of getEmptyCells(board)) {
      board[index] = player;
      const score = minimax(board, depth + 1, false, player, opponent);
      board[index] = null;
      maxScore = Math.max(score, maxScore);
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const index of getEmptyCells(board)) {
      board[index] = opponent;
      const score = minimax(board, depth + 1, true, player, opponent);
      board[index] = null;
      minScore = Math.min(score, minScore);
    }
    return minScore;
  }
};

export const getBestMove = (board: Board, player: Player): number => {
  const opponent: Player = player === 'X' ? 'O' : 'X';
  let bestScore = -Infinity;
  let bestMove = -1;

  for (const index of getEmptyCells(board)) {
    board[index] = player;
    const score = minimax(board, 0, false, player, opponent);
    board[index] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }

  return bestMove;
};
