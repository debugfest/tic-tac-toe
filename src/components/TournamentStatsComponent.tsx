import { TournamentStats, Tournament } from '../types/tournament';
import { Trophy, Target, TrendingUp, Clock, Award, BarChart3 } from 'lucide-react';

interface TournamentStatsProps {
  stats: TournamentStats;
  recentTournaments: Tournament[];
}

export const TournamentStatsComponent = ({ stats, recentTournaments }: TournamentStatsProps) => {
  const winRate = stats.totalGamesPlayed > 0 ? (stats.totalGamesWon / stats.totalGamesPlayed) * 100 : 0;
  const tournamentWinRate = stats.totalTournaments > 0 ? (stats.tournamentsWon / stats.totalTournaments) * 100 : 0;

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tournaments Won</p>
              <p className="text-3xl font-bold">{stats.tournamentsWon}</p>
              <p className="text-blue-100 text-sm">{tournamentWinRate.toFixed(1)}% win rate</p>
            </div>
            <Trophy className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Games Won</p>
              <p className="text-3xl font-bold">{stats.totalGamesWon}</p>
              <p className="text-green-100 text-sm">{winRate.toFixed(1)}% win rate</p>
            </div>
            <Target className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Current Streak</p>
              <p className="text-3xl font-bold">{stats.currentWinStreak}</p>
              <p className="text-purple-100 text-sm">games</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Avg Game Time</p>
              <p className="text-3xl font-bold">{formatDuration(stats.averageGameDuration)}</p>
              <p className="text-orange-100 text-sm">per game</p>
            </div>
            <Clock className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-surface rounded-xl p-6 shadow-md border-2 border-board-border">
          <h3 className="text-xl font-bold text-primary-text mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Performance Metrics
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Total Tournaments</span>
              <span className="font-semibold text-primary-text">{stats.totalTournaments}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Total Games Played</span>
              <span className="font-semibold text-primary-text">{stats.totalGamesPlayed}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Longest Win Streak</span>
              <span className="font-semibold text-primary-text">{stats.longestWinStreak}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Favorite Opponent</span>
              <span className="font-semibold text-primary-text">{stats.favoriteOpponent || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Best Performance */}
        <div className="bg-surface rounded-xl p-6 shadow-md border-2 border-board-border">
          <h3 className="text-xl font-bold text-primary-text mb-4 flex items-center gap-2">
            <Award className="w-6 h-6" />
            Best Performance
          </h3>
          
          {stats.bestPerformance ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg">
                <h4 className="font-bold text-lg">{stats.bestPerformance.tournament}</h4>
                <p className="text-yellow-100">
                  {stats.bestPerformance.gamesWon} wins out of {stats.bestPerformance.gamesPlayed} games
                </p>
                <div className="mt-2">
                  <div className="bg-yellow-200 bg-opacity-30 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(stats.bestPerformance.gamesWon / stats.bestPerformance.gamesPlayed) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-secondary-text">No tournament data available</p>
          )}
        </div>
      </div>

      {/* Recent Tournaments */}
      <div className="bg-surface rounded-xl p-6 shadow-md border-2 border-board-border">
        <h3 className="text-xl font-bold text-primary-text mb-4">Recent Tournaments</h3>
        
        {recentTournaments.length > 0 ? (
          <div className="space-y-3">
            {recentTournaments.slice(0, 5).map((tournament) => (
              <div key={tournament.id} className="flex justify-between items-center p-3 bg-background rounded-lg">
                <div>
                  <h4 className="font-semibold text-primary-text">{tournament.name}</h4>
                  <p className="text-sm text-secondary-text">
                    {tournament.players.length} players • {tournament.format} • Best of {tournament.seriesLength}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {tournament.status === 'completed' && tournament.winner && (
                      <>
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-semibold text-primary-text">
                          {tournament.winner.name}
                        </span>
                      </>
                    )}
                    {tournament.status === 'in-progress' && (
                      <span className="text-sm text-blue-500 font-semibold">In Progress</span>
                    )}
                    {tournament.status === 'pending' && (
                      <span className="text-sm text-gray-500 font-semibold">Pending</span>
                    )}
                  </div>
                  <p className="text-xs text-secondary-text">
                    {tournament.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary-text">No tournaments played yet</p>
        )}
      </div>
    </div>
  );
};
