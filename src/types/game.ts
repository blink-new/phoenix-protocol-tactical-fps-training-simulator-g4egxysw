export interface Player {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  experience: number;
  unlockedWeapons: string[];
  achievements: Achievement[];
  stats: PlayerStats;
}

export interface PlayerStats {
  totalShots: number;
  totalHits: number;
  accuracy: number;
  bestTime: number;
  highestScore: number;
  gamesPlayed: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Weapon {
  id: string;
  name: string;
  type: 'pistol' | 'rifle' | 'sniper';
  damage: number;
  accuracy: number;
  fireRate: number;
  reloadTime: number;
  ammoCapacity: number;
  unlockLevel: number;
  description: string;
}

export interface Target {
  id: string;
  x: number;
  y: number;
  size: number;
  type: 'static' | 'moving';
  speed?: number;
  direction?: number;
  hit: boolean;
  points: number;
}

export interface GameSession {
  id: string;
  playerId: string;
  weaponId: string;
  level: number;
  startTime: Date;
  endTime?: Date;
  targets: Target[];
  shots: Shot[];
  score: number;
  accuracy: number;
  completed: boolean;
}

export interface Shot {
  id: string;
  x: number;
  y: number;
  timestamp: Date;
  hit: boolean;
  targetId?: string;
  points: number;
}

export interface TrainingLevel {
  id: string;
  name: string;
  description: string;
  targetCount: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  targetTypes: ('static' | 'moving')[];
  effects: ('smoke' | 'flash' | 'darkness')[];
  unlockLevel: number;
}

export type GameState = 'menu' | 'customization' | 'weaponSelect' | 'training' | 'range' | 'results' | 'achievements';

export interface GameContext {
  player: Player;
  currentWeapon: Weapon;
  currentLevel: TrainingLevel;
  gameState: GameState;
  currentSession?: GameSession;
}