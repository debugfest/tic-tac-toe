import { Tournament, Match, Player } from '../types/tournament';
import { Trophy, Users, Clock, Play } from 'lucide-react';

interface TournamentBracketProps {
  tournament: Tournament;
  onMatchClick: (match: Match) => void;
}

export const TournamentBracket = ({ tournament, onMatchClick }: TournamentBracketProps) => {
  const getMatchStatusColor = (match: Match) => {
    switch (match.status) {
      case 'completed':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 border-gray-300 text-gray-600';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  const getPlayerDisplayName = (player: Player) => {
    return player.name.length > 12 ? `${player.name.substring(0, 12)}...` : player.name;
  };

  const renderMatch = (match: Match) => {
    const isBye = match.player1.id === match.player2.id;
    
    return (
      <div
        key={match.id}
        className={`
          relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
          hover:scale-105 hover:shadow-lg
          ${getMatchStatusColor(match)}
        `}
        onClick={() => onMatchClick(match)}
        style={{
          position: 'absolute',
          left: `${match.bracketPosition.x}px`,
          top: `${match.bracketPosition.y}px`,
          width: '180px',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="text-center">
          <div className="text-xs font-semibold mb-2">
            Round {match.round} • Match {match.id.split('_').pop()}
          </div>
          
          {isBye ? (
            <div className="text-sm font-medium text-blue-600">
              {getPlayerDisplayName(match.player1)} (Bye)
            </div>
          ) : (
            <>
              <div className="text-sm font-medium mb-1">
                {getPlayerDisplayName(match.player1)}
              </div>
              <div className="text-xs text-gray-500 mb-1">vs</div>
              <div className="text-sm font-medium">
                {getPlayerDisplayName(match.player2)}
              </div>
            </>
          )}
          
          {match.series && (
            <div className="mt-2 text-xs">
              <div className="flex justify-between">
                <span>Games: {match.series.games.length}</span>
                <span>Winner: {match.series.winner?.name}</span>
              </div>
            </div>
          )}
          
          <div className="mt-2 flex items-center justify-center gap-1">
            {match.status === 'completed' && <Trophy className="w-4 h-4" />}
            {match.status === 'in-progress' && <Play className="w-4 h-4" />}
            {match.status === 'pending' && <Clock className="w-4 h-4" />}
            <span className="text-xs capitalize">{match.status}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderConnectingLines = () => {
    const lines: JSX.Element[] = [];
    
    tournament.matches.forEach(match => {
      if (match.round > 1) {
        // Find parent matches
        const parentMatches = tournament.matches.filter(m => 
          m.round === match.round - 1 && 
          (m.series?.winner?.id === match.player1.id || m.series?.winner?.id === match.player2.id)
        );
        
        parentMatches.forEach(parentMatch => {
          lines.push(
            <line
              key={`line_${parentMatch.id}_${match.id}`}
              x1={parentMatch.bracketPosition.x}
              y1={parentMatch.bracketPosition.y + 40}
              x2={match.bracketPosition.x}
              y2={match.bracketPosition.y - 40}
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-400"
            />
          );
        });
      }
    });
    
    return lines;
  };

  return (
    <div className="w-full overflow-auto">
      <div className="relative min-h-[600px] bg-gradient-to-br from-surface to-background rounded-xl p-6">
        {/* Tournament Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary-text mb-2">{tournament.name}</h2>
          <div className="flex items-center justify-center gap-4 text-sm text-secondary-text">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{tournament.players.length} Players</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              <span>Best of {tournament.seriesLength}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Round {tournament.currentRound} of {tournament.totalRounds}</span>
            </div>
          </div>
        </div>

        {/* Bracket Visualization */}
        <div className="relative">
          {/* SVG for connecting lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {renderConnectingLines()}
          </svg>
          
          {/* Matches */}
          <div className="relative" style={{ zIndex: 2 }}>
            {tournament.matches.map(renderMatch)}
          </div>
        </div>

        {/* Tournament Status */}
        <div className="mt-8 text-center">
          {tournament.status === 'completed' && tournament.winner && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-xl">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">Tournament Winner!</h3>
              <p className="text-xl">{tournament.winner.name}</p>
            </div>
          )}
          
          {tournament.status === 'in-progress' && (
            <div className="bg-primary text-white p-4 rounded-xl">
              <Play className="w-6 h-6 mx-auto mb-2" />
              <p className="text-lg font-semibold">Tournament in Progress</p>
              <p className="text-sm opacity-90">
                Click on a match to play the next game
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
