import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrainingLevel, Player } from '../types/game';
import { trainingLevels } from '../data/gameData';

interface LevelSelectProps {
  player: Player;
  selectedLevel: TrainingLevel;
  onSelectLevel: (level: TrainingLevel) => void;
  onBack: () => void;
  onStartTraining: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  player,
  selectedLevel,
  onSelectLevel,
  onBack,
  onStartTraining
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 border-green-400/30';
      case 'medium': return 'text-yellow-400 border-yellow-400/30';
      case 'hard': return 'text-red-400 border-red-400/30';
      default: return 'text-accent border-accent/30';
    }
  };

  return (
    <div className="min-h-screen tactical-gradient p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-4xl font-bold text-white mb-2">
            TRAINING LEVELS
          </h1>
          <p className="text-muted-foreground">Select your training scenario</p>
        </div>

        {/* Level Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {trainingLevels.map((level, index) => {
            const isUnlocked = player.level >= level.unlockLevel;
            const isSelected = selectedLevel.id === level.id;
            
            return (
              <Card
                key={level.id}
                className={`tactical-border p-6 cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'tactical-glow bg-accent/10 border-accent' 
                    : isUnlocked 
                      ? 'hover:bg-accent/5 hover:border-accent/50' 
                      : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => isUnlocked && onSelectLevel(level)}
              >
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto mb-3 bg-accent/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-orbitron font-bold text-accent">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="font-orbitron text-xl font-bold text-white mb-2">
                    {level.name}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className={`tactical-border ${getDifficultyColor(level.difficulty)}`}
                  >
                    {level.difficulty.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Targets:</span>
                    <span className="text-accent">{level.targetCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Limit:</span>
                    <span className="text-accent">{level.timeLimit}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Types:</span>
                    <span className="text-accent">
                      {level.targetTypes.join(', ')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4">
                  {level.description}
                </p>

                {level.effects.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Effects:</p>
                    <div className="flex flex-wrap gap-1">
                      {level.effects.map(effect => (
                        <Badge 
                          key={effect} 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {!isUnlocked && (
                  <div className="text-center">
                    <Badge variant="destructive" className="text-xs">
                      Unlock at Level {level.unlockLevel}
                    </Badge>
                  </div>
                )}

                {isSelected && (
                  <div className="text-center">
                    <Badge className="bg-accent text-black font-bold">
                      SELECTED
                    </Badge>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Selected Level Details */}
        <Card className="tactical-border bg-background/80 backdrop-blur-sm p-6 mb-8">
          <h3 className="font-orbitron text-2xl font-bold text-white mb-4">
            {selectedLevel.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-muted-foreground mb-4">
                {selectedLevel.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Difficulty:</span>
                  <Badge 
                    variant="outline" 
                    className={`tactical-border ${getDifficultyColor(selectedLevel.difficulty)}`}
                  >
                    {selectedLevel.difficulty.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Target Count:</span>
                  <span className="text-accent">{selectedLevel.targetCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Limit:</span>
                  <span className="text-accent">{selectedLevel.timeLimit} seconds</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-orbitron text-lg font-bold text-white mb-3">
                SCENARIO DETAILS
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Target Types:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedLevel.targetTypes.map(type => (
                      <Badge key={type} variant="outline" className="tactical-border text-accent border-accent/30">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {selectedLevel.effects.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground">Environmental Effects:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedLevel.effects.map(effect => (
                        <Badge key={effect} variant="secondary" className="text-xs">
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="tactical-border font-orbitron"
          >
            Back
          </Button>
          <Button
            onClick={onStartTraining}
            className="bg-accent hover:bg-accent/80 text-black font-bold font-orbitron px-8"
          >
            Start Training
          </Button>
        </div>
      </div>
    </div>
  );
};