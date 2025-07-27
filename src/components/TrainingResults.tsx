import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Shot, TrainingLevel, Weapon } from '../types/game';

interface TrainingResultsProps {
  level: TrainingLevel;
  weapon: Weapon;
  score: number;
  accuracy: number;
  shots: Shot[];
  timeUsed: number;
  onRetry: () => void;
  onNextLevel: () => void;
  onBackToMenu: () => void;
}

export const TrainingResults: React.FC<TrainingResultsProps> = ({
  level,
  weapon,
  score,
  accuracy,
  shots,
  timeUsed,
  onRetry,
  onNextLevel,
  onBackToMenu
}) => {
  const hits = shots.filter(s => s.hit).length;
  const totalShots = shots.length;
  const timeRemaining = level.timeLimit - timeUsed;
  
  // Calculate performance grade
  const getGrade = () => {
    if (accuracy >= 90) return { grade: 'S', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    if (accuracy >= 80) return { grade: 'A', color: 'text-green-400', bg: 'bg-green-400/20' };
    if (accuracy >= 70) return { grade: 'B', color: 'text-blue-400', bg: 'bg-blue-400/20' };
    if (accuracy >= 60) return { grade: 'C', color: 'text-orange-400', bg: 'bg-orange-400/20' };
    return { grade: 'D', color: 'text-red-400', bg: 'bg-red-400/20' };
  };

  const gradeInfo = getGrade();
  const isLevelComplete = hits >= level.targetCount * 0.6; // 60% hit rate to pass

  return (
    <div className="min-h-screen tactical-gradient flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-4xl font-bold text-white mb-2">
            TRAINING COMPLETE
          </h1>
          <p className="text-muted-foreground">{level.name} Results</p>
        </div>

        {/* Performance Grade */}
        <Card className="tactical-border bg-background/80 backdrop-blur-sm p-8 text-center mb-8">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${gradeInfo.bg} mb-4`}>
            <span className={`font-orbitron text-4xl font-bold ${gradeInfo.color}`}>
              {gradeInfo.grade}
            </span>
          </div>
          <h2 className="font-orbitron text-2xl font-bold text-white mb-2">
            {isLevelComplete ? 'MISSION SUCCESS' : 'TRAINING INCOMPLETE'}
          </h2>
          <p className="text-muted-foreground">
            {isLevelComplete 
              ? 'Excellent marksmanship, soldier!' 
              : 'More practice required. Try again!'}
          </p>
        </Card>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Performance Metrics */}
          <Card className="tactical-border bg-background/80 backdrop-blur-sm p-6">
            <h3 className="font-orbitron text-xl font-bold text-white mb-4">
              PERFORMANCE METRICS
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Accuracy</span>
                  <span className="text-accent font-bold">{accuracy.toFixed(1)}%</span>
                </div>
                <Progress value={accuracy} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span>Score</span>
                  <span className="text-accent font-bold">{score}</span>
                </div>
                <Progress value={Math.min(score / 1000 * 100, 100)} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{hits}</div>
                  <div className="text-sm text-muted-foreground">Hits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{totalShots}</div>
                  <div className="text-sm text-muted-foreground">Shots</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Training Details */}
          <Card className="tactical-border bg-background/80 backdrop-blur-sm p-6">
            <h3 className="font-orbitron text-xl font-bold text-white mb-4">
              TRAINING DETAILS
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Level:</span>
                <span className="text-accent">{level.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Weapon:</span>
                <span className="text-accent">{weapon.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Targets:</span>
                <span className="text-accent">{hits}/{level.targetCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Used:</span>
                <span className="text-accent">{timeUsed}s</span>
              </div>
              <div className="flex justify-between">
                <span>Time Remaining:</span>
                <span className="text-accent">{Math.max(0, timeRemaining)}s</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="tactical-border bg-background/80 backdrop-blur-sm p-6 mb-8">
          <h3 className="font-orbitron text-xl font-bold text-white mb-4">
            ACHIEVEMENTS
          </h3>
          <div className="flex flex-wrap gap-3">
            {accuracy === 100 && (
              <Badge className="bg-yellow-500 text-black font-bold achievement-unlock">
                💯 Perfect Accuracy
              </Badge>
            )}
            {accuracy >= 90 && (
              <Badge className="bg-green-500 text-black font-bold achievement-unlock">
                🎯 Marksman
              </Badge>
            )}
            {timeUsed <= 20 && (
              <Badge className="bg-blue-500 text-black font-bold achievement-unlock">
                ⚡ Speed Shooter
              </Badge>
            )}
            {hits === level.targetCount && (
              <Badge className="bg-purple-500 text-black font-bold achievement-unlock">
                🏆 All Targets Hit
              </Badge>
            )}
            {totalShots === hits && hits > 0 && (
              <Badge className="bg-red-500 text-black font-bold achievement-unlock">
                🔥 No Wasted Shots
              </Badge>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={onBackToMenu}
            variant="outline"
            className="tactical-border font-orbitron"
          >
            Back to Menu
          </Button>
          
          <Button
            onClick={onRetry}
            variant="outline"
            className="tactical-border font-orbitron"
          >
            Retry Training
          </Button>
          
          {isLevelComplete && (
            <Button
              onClick={onNextLevel}
              className="bg-accent hover:bg-accent/80 text-black font-bold font-orbitron px-8"
            >
              Next Level
            </Button>
          )}
        </div>

        {/* Performance Tips */}
        <Card className="tactical-border bg-background/80 backdrop-blur-sm p-6 mt-8">
          <h3 className="font-orbitron text-lg font-bold text-white mb-3">
            TACTICAL ANALYSIS
          </h3>
          <div className="text-sm text-muted-foreground space-y-2">
            {accuracy < 70 && (
              <p>• Focus on steady aim before firing. Take your time to line up shots.</p>
            )}
            {timeUsed > level.timeLimit * 0.8 && (
              <p>• Work on target acquisition speed. Practice quick target identification.</p>
            )}
            {totalShots > level.targetCount * 2 && (
              <p>• Conserve ammunition. Each shot should be deliberate and calculated.</p>
            )}
            {accuracy >= 90 && (
              <p>• Excellent precision! You're ready for more challenging scenarios.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};