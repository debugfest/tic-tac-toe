export interface Player {
  id: string;
  name: string;
  avatar?: string;
  wins: number;
  losses: number;
}

export interface GameResult {
  playerX: Player;
  playerO: Player;
  winner: 'X' | 'O' | 'draw';
  moves: number;
  duration: number; // in seconds
  timestamp: Date;
}

export interface SeriesResult {
  playerX: Player;
  playerO: Player;
  games: GameResult[];
  winner: Player | null;
  seriesLength: 3 | 5;
  completedAt: Date;
}

export interface Match {
  id: string;
  round: number;
  player1: Player;
  player2: Player;
  series: SeriesResult | null;
  status: 'pending' | 'in-progress' | 'completed';
  bracketPosition: {
    x: number;
    y: number;
  };
}

export interface Tournament {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  format: 'single-elimination' | 'double-elimination';
  seriesLength: 3 | 5;
  players: Player[];
  matches: Match[];
  winner: Player | null;
  createdAt: Date;
  completedAt: Date | null;
  currentRound: number;
  totalRounds: number;
}

export interface TournamentStats {
  totalTournaments: number;
  tournamentsWon: number;
  totalGamesPlayed: number;
  totalGamesWon: number;
  longestWinStreak: number;
  currentWinStreak: number;
  averageGameDuration: number;
  favoriteOpponent: string;
  bestPerformance: {
    tournament: string;
    gamesWon: number;
    gamesPlayed: number;
  };
}

export type TournamentMode = 'single-elimination' | 'double-elimination';
export type SeriesLength = 3 | 5;
