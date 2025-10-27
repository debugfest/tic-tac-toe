import { TournamentStats, Tournament, GameResult, Player } from '../types/tournament';

// Local storage keys
const TOURNAMENT_HISTORY_KEY = 'tic-tac-toe-tournament-history';
const PLAYER_STATS_KEY = 'tic-tac-toe-player-stats';

export class TournamentStatsManager {
  private static instance: TournamentStatsManager;
  private tournaments: Tournament[] = [];
  private playerStats: Map<string, TournamentStats> = new Map();

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): TournamentStatsManager {
    if (!TournamentStatsManager.instance) {
      TournamentStatsManager.instance = new TournamentStatsManager();
    }
    return TournamentStatsManager.instance;
  }

  private loadFromStorage(): void {
    try {
      const tournamentData = localStorage.getItem(TOURNAMENT_HISTORY_KEY);
      if (tournamentData) {
        this.tournaments = JSON.parse(tournamentData).map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          completedAt: t.completedAt ? new Date(t.completedAt) : null,
        }));
      }

      const statsData = localStorage.getItem(PLAYER_STATS_KEY);
      if (statsData) {
        const parsedStats = JSON.parse(statsData);
        this.playerStats = new Map(Object.entries(parsedStats));
      }
    } catch (error) {
      console.error('Failed to load tournament data from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(TOURNAMENT_HISTORY_KEY, JSON.stringify(this.tournaments));
      
      const statsObject = Object.fromEntries(this.playerStats);
      localStorage.setItem(PLAYER_STATS_KEY, JSON.stringify(statsObject));
    } catch (error) {
      console.error('Failed to save tournament data to storage:', error);
    }
  }

  public addTournament(tournament: Tournament): void {
    this.tournaments.push(tournament);
    this.saveToStorage();
  }

  public updateTournament(tournament: Tournament): void {
    const index = this.tournaments.findIndex(t => t.id === tournament.id);
    if (index !== -1) {
      this.tournaments[index] = tournament;
      this.saveToStorage();
    }
  }

  public getTournamentHistory(): Tournament[] {
    return [...this.tournaments].sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  public getRecentTournaments(limit: number = 10): Tournament[] {
    return this.getTournamentHistory().slice(0, limit);
  }

  public getPlayerStats(playerId: string): TournamentStats {
    if (!this.playerStats.has(playerId)) {
      this.playerStats.set(playerId, this.createEmptyStats());
    }
    return this.playerStats.get(playerId)!;
  }

  private createEmptyStats(): TournamentStats {
    return {
      totalTournaments: 0,
      tournamentsWon: 0,
      totalGamesPlayed: 0,
      totalGamesWon: 0,
      longestWinStreak: 0,
      currentWinStreak: 0,
      averageGameDuration: 0,
      favoriteOpponent: '',
      bestPerformance: {
        tournament: '',
        gamesWon: 0,
        gamesPlayed: 0,
      },
    };
  }

  public updatePlayerStats(playerId: string, gameResult: GameResult): void {
    const stats = this.getPlayerStats(playerId);
    
    stats.totalGamesPlayed++;
    
    if (gameResult.winner === 'X' && gameResult.playerX.id === playerId) {
      stats.totalGamesWon++;
      stats.currentWinStreak++;
      stats.longestWinStreak = Math.max(stats.longestWinStreak, stats.currentWinStreak);
    } else if (gameResult.winner === 'O' && gameResult.playerO.id === playerId) {
      stats.totalGamesWon++;
      stats.currentWinStreak++;
      stats.longestWinStreak = Math.max(stats.longestWinStreak, stats.currentWinStreak);
    } else {
      stats.currentWinStreak = 0;
    }

    // Update average game duration
    const totalDuration = stats.averageGameDuration * (stats.totalGamesPlayed - 1) + gameResult.duration;
    stats.averageGameDuration = totalDuration / stats.totalGamesPlayed;

    this.playerStats.set(playerId, stats);
    this.saveToStorage();
  }

  public updateTournamentStats(tournament: Tournament): void {
    if (tournament.status !== 'completed' || !tournament.winner) return;

    // Update winner's tournament stats
    const winnerStats = this.getPlayerStats(tournament.winner.id);
    winnerStats.totalTournaments++;
    winnerStats.tournamentsWon++;

    // Update all players' tournament participation
    tournament.players.forEach(player => {
      const stats = this.getPlayerStats(player.id);
      stats.totalTournaments++;
    });

    // Find best performance
    tournament.matches.forEach(match => {
      if (match.series) {
        match.series.games.forEach(game => {
          this.updatePlayerStats(game.playerX.id, game);
          this.updatePlayerStats(game.playerO.id, game);
        });
      }
    });

    this.saveToStorage();
  }

  public getFavoriteOpponent(playerId: string): string {
    const playerGames = this.tournaments
      .flatMap(t => t.matches)
      .filter(m => m.series)
      .flatMap(m => m.series!.games)
      .filter(g => g.playerX.id === playerId || g.playerO.id === playerId);

    const opponentCounts = new Map<string, number>();
    
    playerGames.forEach(game => {
      const opponent = game.playerX.id === playerId ? game.playerO : game.playerX;
      opponentCounts.set(opponent.name, (opponentCounts.get(opponent.name) || 0) + 1);
    });

    let favoriteOpponent = '';
    let maxCount = 0;
    
    opponentCounts.forEach((count, name) => {
      if (count > maxCount) {
        maxCount = count;
        favoriteOpponent = name;
      }
    });

    return favoriteOpponent;
  }

  public getBestPerformance(playerId: string): { tournament: string; gamesWon: number; gamesPlayed: number } {
    let bestPerformance = { tournament: '', gamesWon: 0, gamesPlayed: 0 };
    let bestWinRate = 0;

    this.tournaments.forEach(tournament => {
      const playerGames = tournament.matches
        .filter(m => m.series)
        .flatMap(m => m.series!.games)
        .filter(g => g.playerX.id === playerId || g.playerO.id === playerId);

      if (playerGames.length === 0) return;

      const gamesWon = playerGames.filter(g => 
        (g.winner === 'X' && g.playerX.id === playerId) ||
        (g.winner === 'O' && g.playerO.id === playerId)
      ).length;

      const winRate = gamesWon / playerGames.length;
      
      if (winRate > bestWinRate) {
        bestWinRate = winRate;
        bestPerformance = {
          tournament: tournament.name,
          gamesWon,
          gamesPlayed: playerGames.length,
        };
      }
    });

    return bestPerformance;
  }

  public getLeaderboard(): Array<{ player: Player; stats: TournamentStats }> {
    const leaderboard: Array<{ player: Player; stats: TournamentStats }> = [];
    
    // Get all unique players from tournament history
    const playerMap = new Map<string, Player>();
    
    this.tournaments.forEach(tournament => {
      tournament.players.forEach(player => {
        playerMap.set(player.id, player);
      });
    });

    playerMap.forEach((player, playerId) => {
      const stats = this.getPlayerStats(playerId);
      leaderboard.push({ player, stats });
    });

    // Sort by tournament wins, then by win rate
    return leaderboard.sort((a, b) => {
      if (b.stats.tournamentsWon !== a.stats.tournamentsWon) {
        return b.stats.tournamentsWon - a.stats.tournamentsWon;
      }
      
      const aWinRate = a.stats.totalGamesPlayed > 0 ? a.stats.totalGamesWon / a.stats.totalGamesPlayed : 0;
      const bWinRate = b.stats.totalGamesPlayed > 0 ? b.stats.totalGamesWon / b.stats.totalGamesPlayed : 0;
      
      return bWinRate - aWinRate;
    });
  }

  public clearAllData(): void {
    this.tournaments = [];
    this.playerStats.clear();
    this.saveToStorage();
  }

  public exportData(): string {
    return JSON.stringify({
      tournaments: this.tournaments,
      playerStats: Object.fromEntries(this.playerStats),
      exportDate: new Date().toISOString(),
    });
  }

  public importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      
      if (parsed.tournaments && Array.isArray(parsed.tournaments)) {
        this.tournaments = parsed.tournaments.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          completedAt: t.completedAt ? new Date(t.completedAt) : null,
        }));
      }
      
      if (parsed.playerStats) {
        this.playerStats = new Map(Object.entries(parsed.playerStats));
      }
      
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Failed to import tournament data:', error);
      return false;
    }
  }
}
