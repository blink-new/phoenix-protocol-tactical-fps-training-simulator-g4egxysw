import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Target, Shot, TrainingLevel, Weapon } from '../types/game';
import { UserProfile } from './UserProfile';

interface ShootingRangeProps {
  level: TrainingLevel;
  weapon: Weapon;
  onComplete: (score: number, accuracy: number, shots: Shot[]) => void;
  onBack: () => void;
  avatar?: string | null;
  playerStats?: {
    level: number;
    totalScore: number;
    accuracy: number;
    achievements: string[];
  };
}

export const ShootingRange: React.FC<ShootingRangeProps> = ({
  level,
  weapon,
  onComplete,
  onBack,
  avatar,
  playerStats
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(level.timeLimit);
  const [targets, setTargets] = useState<Target[]>([]);
  const [shots, setShots] = useState<Shot[]>([]);
  const [ammo, setAmmo] = useState(weapon.ammoCapacity);
  const [isReloading, setIsReloading] = useState(false);
  const [score, setScore] = useState(0);
  const [crosshairPos, setCrosshairPos] = useState({ x: 50, y: 50 });
  const [muzzleFlash, setMuzzleFlash] = useState(false);
  const rangeRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number>();

  // Generate targets
  const generateTargets = useCallback(() => {
    const newTargets: Target[] = [];
    for (let i = 0; i < level.targetCount; i++) {
      const target: Target = {
        id: `target-${i}`,
        x: Math.random() * 80 + 10, // 10-90% of width
        y: Math.random() * 60 + 20, // 20-80% of height
        size: 60,
        type: level.targetTypes[Math.floor(Math.random() * level.targetTypes.length)],
        hit: false,
        points: 100,
        speed: level.targetTypes.includes('moving') ? Math.random() * 2 + 1 : 0,
        direction: Math.random() * 360
      };
      newTargets.push(target);
    }
    setTargets(newTargets);
  }, [level]);

  // End game
  const endGame = useCallback(() => {
    setGameStarted(false);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    const accuracy = shots.length > 0 ? (shots.filter(s => s.hit).length / shots.length) * 100 : 0;
    onComplete(score, accuracy, shots);
  }, [shots, score, onComplete]);

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(level.timeLimit);
    setAmmo(weapon.ammoCapacity);
    setScore(0);
    setShots([]);
    generateTargets();
  };

  // Game timer
  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameStarted && timeLeft === 0) {
      endGame();
    }
  }, [gameStarted, timeLeft, endGame]);

  // Move targets
  useEffect(() => {
    if (!gameStarted) return;

    gameLoopRef.current = setInterval(() => {
      setTargets(prevTargets => 
        prevTargets.map(target => {
          if (target.type === 'moving' && !target.hit && target.speed) {
            const newX = target.x + Math.cos(target.direction! * Math.PI / 180) * target.speed * 0.5;
            const newY = target.y + Math.sin(target.direction! * Math.PI / 180) * target.speed * 0.5;
            
            // Bounce off walls
            let newDirection = target.direction;
            if (newX <= 5 || newX >= 95) newDirection = 180 - target.direction!;
            if (newY <= 15 || newY >= 85) newDirection = -target.direction!;
            
            return {
              ...target,
              x: Math.max(5, Math.min(95, newX)),
              y: Math.max(15, Math.min(85, newY)),
              direction: newDirection
            };
          }
          return target;
        })
      );
    }, 50);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameStarted]);

  // Handle mouse move for crosshair
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!rangeRef.current) return;
    const rect = rangeRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCrosshairPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  // Handle shooting
  const handleShoot = (e: React.MouseEvent) => {
    if (!gameStarted || ammo === 0 || isReloading) return;

    // Muzzle flash effect
    setMuzzleFlash(true);
    setTimeout(() => setMuzzleFlash(false), 100);

    const shot: Shot = {
      id: `shot-${Date.now()}`,
      x: crosshairPos.x,
      y: crosshairPos.y,
      timestamp: new Date(),
      hit: false,
      points: 0
    };

    // Check for hits
    const hitTarget = targets.find(target => {
      if (target.hit) return false;
      const distance = Math.sqrt(
        Math.pow(target.x - crosshairPos.x, 2) + 
        Math.pow(target.y - crosshairPos.y, 2)
      );
      return distance < target.size / 8; // Hit detection radius
    });

    if (hitTarget) {
      shot.hit = true;
      shot.targetId = hitTarget.id;
      shot.points = hitTarget.points;
      setScore(prev => prev + hitTarget.points);
      
      // Mark target as hit
      setTargets(prev => 
        prev.map(t => t.id === hitTarget.id ? { ...t, hit: true } : t)
      );
    }

    setShots(prev => [...prev, shot]);
    setAmmo(prev => prev - 1);

    // Check if all targets hit
    const remainingTargets = targets.filter(t => !t.hit && t.id !== hitTarget?.id);
    if (remainingTargets.length === 0) {
      setTimeout(endGame, 500);
    }
  };

  // Reload weapon
  const reload = () => {
    if (isReloading || ammo === weapon.ammoCapacity) return;
    setIsReloading(true);
    setTimeout(() => {
      setAmmo(weapon.ammoCapacity);
      setIsReloading(false);
    }, weapon.reloadTime * 1000);
  };

  const hitsCount = shots.filter(s => s.hit).length;
  const accuracy = shots.length > 0 ? (hitsCount / shots.length) * 100 : 0;
  const targetsHit = targets.filter(t => t.hit).length;

  return (
    <div className="min-h-screen tactical-gradient p-4">
      {/* User Profile */}
      {gameStarted && avatar && playerStats && (
        <UserProfile 
          avatar={avatar}
          playerStats={playerStats}
        />
      )}

      {/* HUD */}
      <div className="fixed top-4 left-4 right-4 z-10">
        <div className="flex justify-between items-start">
          <Card className="tactical-border bg-background/80 backdrop-blur-sm p-4">
            <div className="font-orbitron text-sm space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-accent">TIME:</span>
                <span className="text-2xl font-bold text-white">{timeLeft}s</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-accent">AMMO:</span>
                <span className="text-xl font-bold text-white">{ammo}/{weapon.ammoCapacity}</span>
              </div>
            </div>
          </Card>

          <Card className="tactical-border bg-background/80 backdrop-blur-sm p-4">
            <div className="font-orbitron text-sm space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-accent">SCORE:</span>
                <span className="text-2xl font-bold text-white">{score}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-accent">HITS:</span>
                <span className="text-xl font-bold text-white">{targetsHit}/{level.targetCount}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Shooting Range */}
      <div className="flex items-center justify-center min-h-screen pt-24">
        {!gameStarted ? (
          <Card className="tactical-border bg-background/80 backdrop-blur-sm p-8 text-center max-w-md">
            <h2 className="font-orbitron text-2xl font-bold text-white mb-4">
              {level.name}
            </h2>
            <p className="text-muted-foreground mb-6">{level.description}</p>
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between">
                <span>Weapon:</span>
                <span className="text-accent">{weapon.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Targets:</span>
                <span className="text-accent">{level.targetCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Limit:</span>
                <span className="text-accent">{level.timeLimit}s</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={onBack} variant="outline" className="tactical-border">
                Back
              </Button>
              <Button onClick={startGame} className="bg-accent hover:bg-accent/80 text-black font-bold">
                Start Training
              </Button>
            </div>
          </Card>
        ) : (
          <div
            ref={rangeRef}
            className="relative w-full max-w-6xl h-96 bg-gradient-to-b from-muted/20 to-muted/40 rounded-lg tactical-border cursor-crosshair overflow-hidden"
            onMouseMove={handleMouseMove}
            onClick={handleShoot}
          >
            {/* Crosshair */}
            <div
              className="absolute w-6 h-6 crosshair pointer-events-none z-20"
              style={{
                left: `${crosshairPos.x}%`,
                top: `${crosshairPos.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />

            {/* Muzzle Flash */}
            {muzzleFlash && (
              <div
                className="absolute w-12 h-12 bg-accent rounded-full muzzle-flash pointer-events-none z-10"
                style={{
                  left: `${crosshairPos.x}%`,
                  top: `${crosshairPos.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            )}

            {/* Targets */}
            {targets.map(target => (
              <div
                key={target.id}
                className={`absolute rounded-full border-4 transition-all duration-200 ${
                  target.hit 
                    ? 'bg-accent border-accent target-hit' 
                    : 'bg-red-600 border-red-400'
                }`}
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  width: `${target.size}px`,
                  height: `${target.size}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="absolute inset-2 rounded-full bg-white/20" />
                <div className="absolute inset-4 rounded-full bg-white/40" />
                <div className="absolute inset-6 rounded-full bg-white/60" />
              </div>
            ))}

            {/* Shot markers */}
            {shots.map(shot => (
              <div
                key={shot.id}
                className={`absolute w-2 h-2 rounded-full ${
                  shot.hit ? 'bg-green-400' : 'bg-red-400'
                }`}
                style={{
                  left: `${shot.x}%`,
                  top: `${shot.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      {gameStarted && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <Button
            onClick={reload}
            disabled={isReloading || ammo === weapon.ammoCapacity}
            className="bg-accent hover:bg-accent/80 text-black font-bold font-orbitron"
          >
            {isReloading ? 'RELOADING...' : 'RELOAD'}
          </Button>
        </div>
      )}
    </div>
  );
};