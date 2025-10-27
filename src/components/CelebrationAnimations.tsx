import { useEffect, useState } from 'react';
import { Trophy, Star, Zap } from 'lucide-react';

interface CelebrationAnimationsProps {
  isVisible: boolean;
  winner: string;
  type: 'game' | 'series' | 'tournament';
  onComplete: () => void;
}

export const CelebrationAnimations = ({ 
  isVisible, 
  winner, 
  type, 
  onComplete 
}: CelebrationAnimationsProps) => {
  const [animationPhase, setAnimationPhase] = useState<'entering' | 'celebrating' | 'exiting'>('entering');

  useEffect(() => {
    if (!isVisible) return;

    const timer1 = setTimeout(() => setAnimationPhase('celebrating'), 500);
    const timer2 = setTimeout(() => setAnimationPhase('exiting'), 3000);
    const timer3 = setTimeout(() => {
      onComplete();
      setAnimationPhase('entering');
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const getTitle = () => {
    switch (type) {
      case 'game':
        return 'Game Won!';
      case 'series':
        return 'Series Won!';
      case 'tournament':
        return 'Tournament Champion!';
      default:
        return 'Victory!';
    }
  };

  const getSubtitle = () => {
    switch (type) {
      case 'game':
        return `${winner} wins this game!`;
      case 'series':
        return `${winner} wins the series!`;
      case 'tournament':
        return `${winner} is the tournament champion!`;
      default:
        return `${winner} wins!`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Background Overlay */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-500 ${
          animationPhase === 'entering' ? 'opacity-0' : 
          animationPhase === 'celebrating' ? 'opacity-60' : 'opacity-0'
        }`}
      />

      {/* Confetti Animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              i % 4 === 0 ? 'bg-yellow-400' :
              i % 4 === 1 ? 'bg-red-400' :
              i % 4 === 2 ? 'bg-blue-400' : 'bg-green-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `confetti ${2 + Math.random() * 3}s linear forwards`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Celebration Content */}
      <div 
        className={`relative z-10 text-center transition-all duration-500 ${
          animationPhase === 'entering' ? 'scale-50 opacity-0' :
          animationPhase === 'celebrating' ? 'scale-100 opacity-100' :
          'scale-150 opacity-0'
        }`}
      >
        {/* Trophy Icon */}
        <div className="mb-6">
          <Trophy 
            className={`w-24 h-24 mx-auto text-yellow-400 ${
              animationPhase === 'celebrating' ? 'animate-bounce' : ''
            }`}
          />
        </div>

        {/* Title */}
        <h1 
          className={`text-6xl font-bold text-white mb-4 ${
            animationPhase === 'celebrating' ? 'animate-pulse' : ''
          }`}
        >
          {getTitle()}
        </h1>

        {/* Subtitle */}
        <p className="text-2xl text-yellow-200 mb-8">
          {getSubtitle()}
        </p>

        {/* Decorative Elements */}
        <div className="flex justify-center gap-4">
          <Star className="w-8 h-8 text-yellow-300 animate-spin" style={{ animationDuration: '2s' }} />
          <Zap className="w-8 h-8 text-yellow-300 animate-pulse" />
          <Star className="w-8 h-8 text-yellow-300 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Fireworks Animation Component
export const FireworksAnimation = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `firework ${1 + Math.random() * 2}s ease-out forwards`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes firework {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Particle Burst Animation
export const ParticleBurst = ({ 
  isVisible, 
  color = 'yellow' 
}: { 
  isVisible: boolean; 
  color?: string;
}) => {
  if (!isVisible) return null;

  const colorClasses = {
    yellow: 'bg-yellow-400',
    red: 'bg-red-400',
    blue: 'bg-blue-400',
    green: 'bg-green-400',
    purple: 'bg-purple-400',
  };

  return (
    <div className="fixed inset-0 z-30 pointer-events-none flex items-center justify-center">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 ${colorClasses[color]} rounded-full`}
          style={{
            animation: `particleBurst ${1.5}s ease-out forwards`,
            animationDelay: `${i * 0.05}s`,
            transformOrigin: 'center',
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes particleBurst {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(
              ${Math.cos((i * 12) * Math.PI / 180) * 200}px,
              ${Math.sin((i * 12) * Math.PI / 180) * 200}px
            ) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
