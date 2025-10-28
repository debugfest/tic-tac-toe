import { useState, useEffect } from 'react';
import { Tournament, TournamentMode, SeriesLength, Match, SeriesResult } from '../types/tournament';
import { TournamentSettings } from './TournamentSettings';
import { TournamentBracket } from './TournamentBracket';
import { MatchGame } from './MatchGame';
import { TournamentStatsComponent } from './TournamentStatsComponent';
import { CelebrationAnimations } from './CelebrationAnimations';
import { TournamentStatsManager } from '../utils/tournamentStats';
import { createTournament, startTournament, completeMatch, getCurrentRoundMatches } from '../utils/tournamentLogic';
import { Trophy, BarChart3, Settings, ArrowLeft, History } from 'lucide-react';

type TournamentView = 'settings' | 'bracket' | 'match' | 'stats';

export const TournamentMode = () => {
  const [currentView, setCurrentView] = useState<TournamentView>('settings');
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'game' | 'series' | 'tournament'>('game');
  const [celebrationWinner, setCelebrationWinner] = useState('');
  
  const statsManager = TournamentStatsManager.getInstance();
  const [recentTournaments, setRecentTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    setRecentTournaments(statsManager.getRecentTournaments(5));
  }, []);

  const handleCreateTournament = (
    name: string, 
    players: string[], 
    mode: TournamentMode, 
    seriesLength: SeriesLength
  ) => {
    const newTournament = createTournament(name, players, mode, seriesLength);
    const startedTournament = startTournament(newTournament);
    
    setTournament(startedTournament);
    statsManager.addTournament(startedTournament);
    setCurrentView('bracket');
  };

  const handleMatchClick = (match: Match) => {
    if (match.status === 'pending' || match.status === 'in-progress') {
      setCurrentMatch(match);
      setCurrentView('match');
    }
  };

  const handleSeriesComplete = (seriesResult: SeriesResult) => {
    if (!tournament || !currentMatch) return;

    const updatedTournament = completeMatch(tournament, currentMatch.id, seriesResult);
    setTournament(updatedTournament);
    statsManager.updateTournament(updatedTournament);

    // Show celebration
    setCelebrationType('series');
    setCelebrationWinner(seriesResult.winner?.name || 'Draw');
    setShowCelebration(true);

    // Check if tournament is complete
    if (updatedTournament.status === 'completed' && updatedTournament.winner) {
      setTimeout(() => {
        setCelebrationType('tournament');
        setCelebrationWinner(updatedTournament.winner!.name);
        setShowCelebration(true);
      }, 2000);
    }

    setCurrentView('bracket');
    setCurrentMatch(null);
  };

  const handleBackToBracket = () => {
    setCurrentView('bracket');
    setCurrentMatch(null);
  };

  const handleBackToSettings = () => {
    setCurrentView('settings');
    setTournament(null);
    setCurrentMatch(null);
  };

  const handleNewTournament = () => {
    setCurrentView('settings');
    setTournament(null);
    setCurrentMatch(null);
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    setCelebrationWinner('');
  };

  const getCurrentRoundMatches = () => {
    if (!tournament) return [];
    return tournament.matches.filter(match => match.round === tournament.currentRound);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'settings':
        return (
          <TournamentSettings
            onCreateTournament={handleCreateTournament}
            onCancel={() => setCurrentView('bracket')}
          />
        );

      case 'bracket':
        if (!tournament) {
          return (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold text-primary-text mb-4">No Active Tournament</h2>
              <p className="text-secondary-text mb-6">Create a new tournament to get started!</p>
              <button
                onClick={() => setCurrentView('settings')}
                className="px-6 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-opacity-80 transition-colors"
              >
                Create Tournament
              </button>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button
                onClick={handleBackToSettings}
                className="flex items-center gap-2 text-secondary-text hover:text-primary-text transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Settings
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentView('stats')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border-2 border-board-border text-primary-text hover:border-primary transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  Stats
                </button>
                <button
                  onClick={handleNewTournament}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-opacity-80 transition-colors"
                >
                  <Trophy className="w-4 h-4" />
                  New Tournament
                </button>
              </div>
            </div>

            <TournamentBracket
              tournament={tournament}
              onMatchClick={handleMatchClick}
            />
          </div>
        );

      case 'match':
        if (!currentMatch || !tournament) {
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-primary-text">No Match Selected</h2>
              <button
                onClick={handleBackToBracket}
                className="mt-4 px-6 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-opacity-80 transition-colors"
              >
                Back to Bracket
              </button>
            </div>
          );
        }

        return (
          <MatchGame
            match={currentMatch}
            seriesLength={tournament.seriesLength}
            onSeriesComplete={handleSeriesComplete}
            onBack={handleBackToBracket}
          />
        );

      case 'stats':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentView('bracket')}
                className="flex items-center gap-2 text-secondary-text hover:text-primary-text transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Tournament
              </button>
              
              <button
                onClick={() => setCurrentView('settings')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-opacity-80 transition-colors"
              >
                <Trophy className="w-4 h-4" />
                New Tournament
              </button>
            </div>

            <TournamentStatsComponent
              stats={statsManager.getPlayerStats('default')} // You might want to implement player selection
              recentTournaments={recentTournaments}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary-text py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">Tournament Mode</h1>
          <p className="text-secondary-text">
            Compete in bracket-style tournaments with best-of-series matches
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setCurrentView('settings')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentView === 'settings'
                ? 'bg-primary text-white shadow-lg scale-105'
                : 'bg-surface text-primary-text border-2 border-board-border hover:border-primary'
            }`}
          >
            <Settings className="w-5 h-5 inline mr-2" />
            Setup
          </button>
          
          <button
            onClick={() => setCurrentView('bracket')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentView === 'bracket'
                ? 'bg-primary text-white shadow-lg scale-105'
                : 'bg-surface text-primary-text border-2 border-board-border hover:border-primary'
            }`}
          >
            <Trophy className="w-5 h-5 inline mr-2" />
            Tournament
          </button>
          
          <button
            onClick={() => setCurrentView('stats')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentView === 'stats'
                ? 'bg-primary text-white shadow-lg scale-105'
                : 'bg-surface text-primary-text border-2 border-board-border hover:border-primary'
            }`}
          >
            <BarChart3 className="w-5 h-5 inline mr-2" />
            Statistics
          </button>
        </div>

        {/* Main Content */}
        {renderCurrentView()}

        {/* Celebration Animations */}
        <CelebrationAnimations
          isVisible={showCelebration}
          winner={celebrationWinner}
          type={celebrationType}
          onComplete={handleCelebrationComplete}
        />
      </div>
    </div>
  );
};
