import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Weapon, Player } from '../types/game';
import { weapons } from '../data/gameData';

interface WeaponSelectProps {
  player: Player;
  selectedWeapon: Weapon;
  onSelectWeapon: (weapon: Weapon) => void;
  onBack: () => void;
  onStartTraining: () => void;
}

export const WeaponSelect: React.FC<WeaponSelectProps> = ({
  player,
  selectedWeapon,
  onSelectWeapon,
  onBack,
  onStartTraining
}) => {
  return (
    <div className="min-h-screen tactical-gradient p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-4xl font-bold text-white mb-2">
            WEAPON RACK
          </h1>
          <p className="text-muted-foreground">Select your training weapon</p>
        </div>

        {/* Weapon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {weapons.map(weapon => {
            const isUnlocked = player.unlockedWeapons.includes(weapon.id);
            const isSelected = selectedWeapon.id === weapon.id;
            
            return (
              <Card
                key={weapon.id}
                className={`tactical-border p-6 cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'tactical-glow bg-accent/10 border-accent' 
                    : isUnlocked 
                      ? 'hover:bg-accent/5 hover:border-accent/50' 
                      : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => isUnlocked && onSelectWeapon(weapon)}
              >
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto mb-3 bg-accent/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🔫</span>
                  </div>
                  <h3 className="font-orbitron text-xl font-bold text-white mb-1">
                    {weapon.name}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className={`tactical-border ${
                      isUnlocked ? 'text-accent border-accent/30' : 'text-muted-foreground'
                    }`}
                  >
                    {weapon.type.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Damage</span>
                    <div className="flex items-center gap-2">
                      <Progress value={weapon.damage} className="w-16 h-2" />
                      <span className="text-sm text-accent">{weapon.damage}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Accuracy</span>
                    <div className="flex items-center gap-2">
                      <Progress value={weapon.accuracy} className="w-16 h-2" />
                      <span className="text-sm text-accent">{weapon.accuracy}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Ammo</span>
                    <span className="text-sm text-accent">{weapon.ammoCapacity}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-4">
                  {weapon.description}
                </p>

                {!isUnlocked && (
                  <div className="text-center">
                    <Badge variant="destructive" className="text-xs">
                      Unlock at Level {weapon.unlockLevel}
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

        {/* Selected Weapon Details */}
        <Card className="tactical-border bg-background/80 backdrop-blur-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-orbitron text-2xl font-bold text-white mb-2">
                {selectedWeapon.name}
              </h3>
              <p className="text-muted-foreground mb-4">
                {selectedWeapon.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="text-accent">{selectedWeapon.type.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fire Rate:</span>
                  <span className="text-accent">{selectedWeapon.fireRate} RPM</span>
                </div>
                <div className="flex justify-between">
                  <span>Reload Time:</span>
                  <span className="text-accent">{selectedWeapon.reloadTime}s</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Damage</span>
                  <span className="text-sm text-accent">{selectedWeapon.damage}/100</span>
                </div>
                <Progress value={selectedWeapon.damage} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Accuracy</span>
                  <span className="text-sm text-accent">{selectedWeapon.accuracy}/100</span>
                </div>
                <Progress value={selectedWeapon.accuracy} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Fire Rate</span>
                  <span className="text-sm text-accent">{Math.round(selectedWeapon.fireRate / 10)}/100</span>
                </div>
                <Progress value={selectedWeapon.fireRate / 10} className="h-3" />
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
            Back to Menu
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