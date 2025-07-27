import React, { useState, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { WeaponSelect } from './components/WeaponSelect';
import { LevelSelect } from './components/LevelSelect';
import { ShootingRange } from './components/ShootingRange';
import { TrainingResults } from './components/TrainingResults';
import { Player, Weapon, TrainingLevel, GameState, Shot } from './types/game';
import { weapons, trainingLevels, defaultPlayer } from './data/gameData';

function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [player, setPlayer] = useState<Player>(defaultPlayer);
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon>(weapons[0]);
  const [selectedLevel, setSelectedLevel] = useState<TrainingLevel>(trainingLevels[0]);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [lastResults, setLastResults] = useState<{
    score: number;
    accuracy: number;
    shots: Shot[];
    timeUsed: number;
  } | null>(null);

  // Load player data and avatar from localStorage
  useEffect(() => {
    const savedPlayer = localStorage.getItem('phoenix-player');
    if (savedPlayer) {
      try {
        const parsedPlayer = JSON.parse(savedPlayer);
        setPlayer(parsedPlayer);
      } catch (error) {
        console.error('Failed to load player data:', error);
      }
    }

    const savedAvatar = localStorage.getItem('phoenix-avatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  // Save player data to localStorage
  const savePlayerData = (updatedPlayer: Player) => {
    setPlayer(updatedPlayer);
    localStorage.setItem('phoenix-player', JSON.stringify(updatedPlayer));
  };

  // Handle avatar change
  const handleAvatarChange = (avatarUrl: string | null) => {
    setAvatar(avatarUrl);
    if (avatarUrl) {
      localStorage.setItem('phoenix-avatar', avatarUrl);
    } else {
      localStorage.removeItem('phoenix-avatar');
    }
  };

  // Handle training completion
  const handleTrainingComplete = (score: number, accuracy: number, shots: Shot[]) => {
    const timeUsed = selectedLevel.timeLimit;
    
    // Update player stats
    const updatedPlayer = {
      ...player,
      stats: {
        ...player.stats,
        totalShots: player.stats.totalShots + shots.length,
        totalHits: player.stats.totalHits + shots.filter(s => s.hit).length,
        accuracy: ((player.stats.accuracy * player.stats.gamesPlayed + accuracy) / (player.stats.gamesPlayed + 1)),
        bestTime: player.stats.bestTime === 0 ? timeUsed : Math.min(player.stats.bestTime, timeUsed),
        highestScore: Math.max(player.stats.highestScore, score),
        gamesPlayed: player.stats.gamesPlayed + 1
      }
    };

    // Check for level progression
    const hits = shots.filter(s => s.hit).length;
    const isLevelComplete = hits >= selectedLevel.targetCount * 0.6;
    
    if (isLevelComplete && updatedPlayer.level === selectedLevel.unlockLevel) {
      updatedPlayer.level += 1;
      updatedPlayer.experience += score;
      
      // Unlock new weapons
      const newWeapons = weapons.filter(w => 
        w.unlockLevel <= updatedPlayer.level && 
        !updatedPlayer.unlockedWeapons.includes(w.id)
      );
      updatedPlayer.unlockedWeapons.push(...newWeapons.map(w => w.id));
    }

    // Check achievements
    const achievements = [...updatedPlayer.achievements];
    
    // Marksman achievement
    if (accuracy >= 90 && !achievements.find(a => a.id === 'marksman')?.unlocked) {
      const marksman = achievements.find(a => a.id === 'marksman');
      if (marksman) {
        marksman.unlocked = true;
        marksman.unlockedAt = new Date();
      }
    }
    
    // Perfect accuracy achievement
    if (accuracy === 100 && !achievements.find(a => a.id === 'perfect_accuracy')?.unlocked) {
      const perfect = achievements.find(a => a.id === 'perfect_accuracy');
      if (perfect) {
        perfect.unlocked = true;
        perfect.unlockedAt = new Date();
      }
    }
    
    // Speed shooter achievement
    if (timeUsed <= 20 && !achievements.find(a => a.id === 'speed_shooter')?.unlocked) {
      const speed = achievements.find(a => a.id === 'speed_shooter');
      if (speed) {
        speed.unlocked = true;
        speed.unlockedAt = new Date();
      }
    }
    
    // First blood achievement
    if (updatedPlayer.stats.gamesPlayed === 1 && !achievements.find(a => a.id === 'first_blood')?.unlocked) {
      const firstBlood = achievements.find(a => a.id === 'first_blood');
      if (firstBlood) {
        firstBlood.unlocked = true;
        firstBlood.unlockedAt = new Date();
      }
    }

    updatedPlayer.achievements = achievements;
    savePlayerData(updatedPlayer);
    
    setLastResults({ score, accuracy, shots, timeUsed });
    setGameState('results');
  };

  // Handle weapon selection
  const handleWeaponSelect = (weapon: Weapon) => {
    if (player.unlockedWeapons.includes(weapon.id)) {
      setSelectedWeapon(weapon);
    }
  };

  // Handle level selection
  const handleLevelSelect = (level: TrainingLevel) => {
    if (player.level >= level.unlockLevel) {
      setSelectedLevel(level);
    }
  };

  // Navigation handlers
  const goToMenu = () => setGameState('menu');
  const goToWeaponSelect = () => setGameState('weaponSelect');
  const goToLevelSelect = () => setGameState('training');
  const goToTraining = () => setGameState('training');
  const goToCustomization = () => setGameState('customization');
  const goToAchievements = () => setGameState('achievements');

  // Render current screen
  const renderCurrentScreen = () => {
    switch (gameState) {
      case 'menu':
        return (
          <MainMenu
            player={player}
            onStartTraining={goToLevelSelect}
            onCustomizeCharacter={goToCustomization}
            onViewAchievements={goToAchievements}
            onWeaponSelect={goToWeaponSelect}
            avatar={avatar}
            onAvatarChange={handleAvatarChange}
          />
        );

      case 'weaponSelect':
        return (
          <WeaponSelect
            player={player}
            selectedWeapon={selectedWeapon}
            onSelectWeapon={handleWeaponSelect}
            onBack={goToMenu}
            onStartTraining={goToLevelSelect}
          />
        );

      case 'training':
        return (
          <LevelSelect
            player={player}
            selectedLevel={selectedLevel}
            onSelectLevel={handleLevelSelect}
            onBack={goToMenu}
            onStartTraining={() => setGameState('range')}
          />
        );

      case 'range':
        return (
          <ShootingRange
            level={selectedLevel}
            weapon={selectedWeapon}
            onComplete={handleTrainingComplete}
            onBack={() => setGameState('training')}
            avatar={avatar}
            playerStats={{
              level: player.level,
              totalScore: player.stats.highestScore,
              accuracy: player.stats.accuracy,
              achievements: player.achievements.filter(a => a.unlocked).map(a => a.name)
            }}
          />
        );

      case 'results':
        return lastResults ? (
          <TrainingResults
            level={selectedLevel}
            weapon={selectedWeapon}
            score={lastResults.score}
            accuracy={lastResults.accuracy}
            shots={lastResults.shots}
            timeUsed={lastResults.timeUsed}
            onRetry={() => {
              setLastResults(null);
              setGameState('range');
            }}
            onNextLevel={() => {
              const nextLevelIndex = trainingLevels.findIndex(l => l.id === selectedLevel.id) + 1;
              if (nextLevelIndex < trainingLevels.length && player.level >= trainingLevels[nextLevelIndex].unlockLevel) {
                setSelectedLevel(trainingLevels[nextLevelIndex]);
              }
              setLastResults(null);
              setGameState('range');
            }}
            onBackToMenu={() => {
              setLastResults(null);
              goToMenu();
            }}
          />
        ) : null;

      case 'customization':
        return (
          <div className="min-h-screen tactical-gradient flex items-center justify-center p-4">
            <div className="text-center">
              <h1 className="font-orbitron text-4xl font-bold text-white mb-4">
                CHARACTER CUSTOMIZATION
              </h1>
              <p className="text-muted-foreground mb-8">
                Photo upload and AI character generation coming soon!
              </p>
              <button
                onClick={goToMenu}
                className="bg-accent hover:bg-accent/80 text-black font-bold font-orbitron px-8 py-3 rounded"
              >
                Back to Menu
              </button>
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="min-h-screen tactical-gradient flex items-center justify-center p-4">
            <div className="text-center max-w-2xl">
              <h1 className="font-orbitron text-4xl font-bold text-white mb-8">
                ACHIEVEMENTS
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {player.achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`tactical-border p-4 rounded ${
                      achievement.unlocked ? 'bg-accent/10 border-accent' : 'opacity-50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <h3 className="font-orbitron font-bold text-white mb-1">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-xs text-accent mt-2">
                        Unlocked: {achievement.unlockedAt.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={goToMenu}
                className="bg-accent hover:bg-accent/80 text-black font-bold font-orbitron px-8 py-3 rounded"
              >
                Back to Menu
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="App">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;