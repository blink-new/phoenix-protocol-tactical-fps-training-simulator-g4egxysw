import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Player } from '../types/game';
import { AvatarUpload } from './AvatarUpload';

interface MainMenuProps {
  player: Player;
  onStartTraining: () => void;
  onCustomizeCharacter: () => void;
  onViewAchievements: () => void;
  onWeaponSelect: () => void;
  avatar: string | null;
  onAvatarChange: (avatarUrl: string | null) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  player,
  onStartTraining,
  onCustomizeCharacter,
  onViewAchievements,
  onWeaponSelect,
  avatar,
  onAvatarChange
}) => {
  return (
    <div className="min-h-screen tactical-gradient flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-6xl font-bold text-white mb-4 tracking-wider">
            PHOENIX
            <span className="text-accent"> PROTOCOL</span>
          </h1>
          <p className="text-xl text-muted-foreground font-inter">
            Tactical FPS Training Simulator
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <Badge variant="outline" className="tactical-border text-accent border-accent/30">
              Level {player.level}
            </Badge>
            <Badge variant="outline" className="tactical-border text-accent border-accent/30">
              {player.stats.accuracy.toFixed(1)}% Accuracy
            </Badge>
          </div>
        </div>

        {/* Character Profile */}
        <Card className="tactical-border bg-background/50 backdrop-blur-sm mb-8 p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-accent/20 border-2 border-accent/30 overflow-hidden flex items-center justify-center tactical-glow">
              {avatar ? (
                <img 
                  src={avatar} 
                  alt="Marcus Phoenix Rivera" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-orbitron font-bold text-accent">
                  {player.name.split(' ')[0][0]}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-orbitron text-2xl font-bold text-white mb-1">
                {player.name}
              </h2>
              <p className="text-muted-foreground mb-2">
                Former Special Forces • Elite Tactical Instructor
              </p>
              <div className="flex gap-4 text-sm">
                <span className="text-accent">Games: {player.stats.gamesPlayed}</span>
                <span className="text-accent">Best Score: {player.stats.highestScore}</span>
                <span className="text-accent">Achievements: {player.achievements.filter(a => a.unlocked).length}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <AvatarUpload 
                currentAvatar={avatar}
                onAvatarChange={onAvatarChange}
              />
              <p className="text-xs text-muted-foreground text-center">
                Upload your photo
              </p>
            </div>
          </div>
        </Card>

        {/* Menu Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Button
            onClick={onStartTraining}
            className="h-24 text-xl font-orbitron bg-accent hover:bg-accent/80 text-black font-bold tactical-glow"
          >
            <div className="text-center">
              <div>START TRAINING</div>
              <div className="text-sm font-inter opacity-80">Begin shooting range</div>
            </div>
          </Button>

          <Button
            onClick={onWeaponSelect}
            variant="outline"
            className="h-24 text-xl font-orbitron tactical-border hover:bg-accent/10"
          >
            <div className="text-center">
              <div>WEAPON RACK</div>
              <div className="text-sm font-inter opacity-80">Select equipment</div>
            </div>
          </Button>

          <Button
            onClick={onCustomizeCharacter}
            variant="outline"
            className="h-24 text-xl font-orbitron tactical-border hover:bg-accent/10"
          >
            <div className="text-center">
              <div>CUSTOMIZE</div>
              <div className="text-sm font-inter opacity-80">Upload photo</div>
            </div>
          </Button>

          <Button
            onClick={onViewAchievements}
            variant="outline"
            className="h-24 text-xl font-orbitron tactical-border hover:bg-accent/10"
          >
            <div className="text-center">
              <div>ACHIEVEMENTS</div>
              <div className="text-sm font-inter opacity-80">View progress</div>
            </div>
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-muted-foreground">
          <p className="font-inter text-sm">
            "Precision through practice. Excellence through discipline."
          </p>
          <p className="font-inter text-xs mt-2 opacity-60">
            - Marcus "Phoenix" Rivera
          </p>
        </div>
      </div>
    </div>
  );
};