import { useState } from 'react';
import { Users, Trophy, Settings, Play } from 'lucide-react';
import { TournamentMode, SeriesLength } from '../types/tournament';

interface TournamentSettingsProps {
  onCreateTournament: (name: string, players: string[], mode: TournamentMode, seriesLength: SeriesLength) => void;
  onCancel: () => void;
}

export const TournamentSettings = ({ onCreateTournament, onCancel }: TournamentSettingsProps) => {
  const [tournamentName, setTournamentName] = useState('');
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2', 'Player 3', 'Player 4']);
  const [mode, setMode] = useState<TournamentMode>('single-elimination');
  const [seriesLength, setSeriesLength] = useState<SeriesLength>(3);

  const addPlayer = () => {
    if (playerNames.length < 16) { // Max 16 players
      setPlayerNames([...playerNames, `Player ${playerNames.length + 1}`]);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 2) { // Min 2 players
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const updated = [...playerNames];
    updated[index] = name;
    setPlayerNames(updated);
  };

  const handleCreate = () => {
    if (tournamentName.trim() && playerNames.every(name => name.trim())) {
      onCreateTournament(
        tournamentName.trim(),
        playerNames.map(name => name.trim()),
        mode,
        seriesLength
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-surface rounded-xl p-6 shadow-lg border-2 border-board-border">
      <div className="text-center mb-6">
        <Settings className="w-8 h-8 mx-auto mb-2 text-primary" />
        <h2 className="text-2xl font-bold text-primary-text">Tournament Setup</h2>
        <p className="text-secondary-text">Configure your tournament settings</p>
      </div>

      {/* Tournament Name */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-primary-text mb-2">
          Tournament Name
        </label>
        <input
          type="text"
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
          placeholder="Enter tournament name..."
          className="w-full p-3 rounded-lg border-2 border-board-border bg-background text-primary-text focus:border-primary focus:outline-none"
        />
      </div>

      {/* Tournament Format */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-primary-text mb-2">
            Tournament Format
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as TournamentMode)}
            className="w-full p-3 rounded-lg border-2 border-board-border bg-background text-primary-text focus:border-primary focus:outline-none"
          >
            <option value="single-elimination">Single Elimination</option>
            <option value="double-elimination">Double Elimination</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-primary-text mb-2">
            Series Length
          </label>
          <select
            value={seriesLength}
            onChange={(e) => setSeriesLength(parseInt(e.target.value) as SeriesLength)}
            className="w-full p-3 rounded-lg border-2 border-board-border bg-background text-primary-text focus:border-primary focus:outline-none"
          >
            <option value={3}>Best of 3</option>
            <option value={5}>Best of 5</option>
          </select>
        </div>
      </div>

      {/* Players */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-primary-text">
            Players ({playerNames.length})
          </label>
          <button
            onClick={addPlayer}
            disabled={playerNames.length >= 16}
            className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Player
          </button>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {playerNames.map((name, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => updatePlayerName(index, e.target.value)}
                className="flex-1 p-2 rounded-lg border border-board-border bg-background text-primary-text focus:border-primary focus:outline-none"
              />
              <button
                onClick={() => removePlayer(index)}
                disabled={playerNames.length <= 2}
                className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tournament Info */}
      <div className="bg-background rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-primary-text mb-2">Tournament Info</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-secondary-text">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{playerNames.length} Players</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>Best of {seriesLength}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>{mode === 'single-elimination' ? 'Single Elimination' : 'Double Elimination'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            <span>{playerNames.length - 1} Rounds</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          className="px-6 py-3 rounded-lg font-semibold bg-gray-500 text-white hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={!tournamentName.trim() || playerNames.some(name => !name.trim())}
          className="px-6 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Play className="w-5 h-5" />
          Create Tournament
        </button>
      </div>
    </div>
  );
};
