import { Player, Tournament, Match, SeriesResult, GameResult, TournamentMode, SeriesLength } from '../types/tournament';

export const createPlayer = (name: string, id?: string): Player => ({
  id: id || `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name,
  wins: 0,
  losses: 0,
});

export const createTournament = (
  name: string,
  playerNames: string[],
  mode: TournamentMode = 'single-elimination',
  seriesLength: SeriesLength = 3
): Tournament => {
  const players = playerNames.map(name => createPlayer(name));
  const totalRounds = Math.ceil(Math.log2(players.length));
  
  return {
    id: `tournament_${Date.now()}`,
    name,
    status: 'pending',
    format: mode,
    seriesLength,
    players,
    matches: [],
    winner: null,
    createdAt: new Date(),
    completedAt: null,
    currentRound: 1,
    totalRounds,
  };
};

export const generateBracket = (tournament: Tournament): Match[] => {
  const matches: Match[] = [];
  const players = [...tournament.players];
  
  // Shuffle players for random seeding
  for (let i = players.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [players[i], players[j]] = [players[j], players[i]];
  }

  // Calculate bracket positions
  const calculatePosition = (round: number, matchIndex: number, totalMatches: number) => {
    const bracketWidth = Math.pow(2, tournament.totalRounds - round + 1);
    const bracketHeight = Math.pow(2, tournament.totalRounds);
    
    return {
      x: (matchIndex * bracketWidth) + (bracketWidth / 2),
      y: (round - 1) * (bracketHeight / tournament.totalRounds) + (bracketHeight / (tournament.totalRounds * 2))
    };
  };

  // Generate first round matches
  let currentPlayers = [...players];
  let round = 1;
  
  while (currentPlayers.length > 1) {
    const roundMatches: Match[] = [];
    const nextRoundPlayers: Player[] = [];
    
    for (let i = 0; i < currentPlayers.length; i += 2) {
      const player1 = currentPlayers[i];
      const player2 = currentPlayers[i + 1] || null;
      
      if (player2) {
        const match: Match = {
          id: `match_${tournament.id}_${round}_${i / 2}`,
          round,
          player1,
          player2,
          series: null,
          status: 'pending',
          bracketPosition: calculatePosition(round, i / 2, Math.ceil(currentPlayers.length / 2))
        };
        
        roundMatches.push(match);
        matches.push(match);
      } else {
        // Odd number of players - bye to next round
        nextRoundPlayers.push(player1);
      }
    }
    
    currentPlayers = nextRoundPlayers;
    round++;
  }

  return matches;
};

export const startTournament = (tournament: Tournament): Tournament => {
  const matches = generateBracket(tournament);
  
  return {
    ...tournament,
    status: 'in-progress',
    matches,
    currentRound: 1,
  };
};

export const getCurrentRoundMatches = (tournament: Tournament): Match[] => {
  return tournament.matches.filter(match => match.round === tournament.currentRound);
};

export const getNextRoundMatches = (tournament: Tournament): Match[] => {
  return tournament.matches.filter(match => match.round === tournament.currentRound + 1);
};

export const advanceToNextRound = (tournament: Tournament): Tournament => {
  const currentRoundMatches = getCurrentRoundMatches(tournament);
  const allCurrentRoundComplete = currentRoundMatches.every(match => match.status === 'completed');
  
  if (!allCurrentRoundComplete) {
    return tournament; // Can't advance yet
  }

  const winners = currentRoundMatches
    .map(match => match.series?.winner)
    .filter((winner): winner is Player => winner !== null);

  if (winners.length === 1) {
    // Tournament complete
    return {
      ...tournament,
      status: 'completed',
      winner: winners[0],
      completedAt: new Date(),
    };
  }

  // Generate next round matches
  const nextRound = tournament.currentRound + 1;
  const nextRoundMatches: Match[] = [];
  
  for (let i = 0; i < winners.length; i += 2) {
    const player1 = winners[i];
    const player2 = winners[i + 1] || null;
    
    if (player2) {
      const match: Match = {
        id: `match_${tournament.id}_${nextRound}_${i / 2}`,
        round: nextRound,
        player1,
        player2,
        series: null,
        status: 'pending',
        bracketPosition: {
          x: (i / 2) * 200 + 100,
          y: (nextRound - 1) * 150 + 75
        }
      };
      
      nextRoundMatches.push(match);
    } else {
      // Odd number of winners - bye to next round
      const byeMatch: Match = {
        id: `match_${tournament.id}_${nextRound}_bye`,
        round: nextRound,
        player1,
        player2: player1, // Self-match for bye
        series: null,
        status: 'completed',
        bracketPosition: {
          x: (i / 2) * 200 + 100,
          y: (nextRound - 1) * 150 + 75
        }
      };
      
      // Create a completed series for the bye
      byeMatch.series = {
        playerX: player1,
        playerO: player1,
        games: [],
        winner: player1,
        seriesLength: tournament.seriesLength,
        completedAt: new Date()
      };
      
      nextRoundMatches.push(byeMatch);
    }
  }

  return {
    ...tournament,
    currentRound: nextRound,
    matches: [...tournament.matches, ...nextRoundMatches],
  };
};

export const completeMatch = (
  tournament: Tournament,
  matchId: string,
  seriesResult: SeriesResult
): Tournament => {
  const updatedMatches = tournament.matches.map(match => {
    if (match.id === matchId) {
      return {
        ...match,
        series: seriesResult,
        status: 'completed' as const,
      };
    }
    return match;
  });

  const updatedTournament = {
    ...tournament,
    matches: updatedMatches,
  };

  // Check if we can advance to next round
  return advanceToNextRound(updatedTournament);
};

export const getTournamentProgress = (tournament: Tournament) => {
  const totalMatches = tournament.matches.length;
  const completedMatches = tournament.matches.filter(match => match.status === 'completed').length;
  const currentRoundMatches = getCurrentRoundMatches(tournament);
  const currentRoundComplete = currentRoundMatches.every(match => match.status === 'completed');
  
  return {
    totalMatches,
    completedMatches,
    progress: totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0,
    currentRoundComplete,
    isComplete: tournament.status === 'completed',
  };
};
