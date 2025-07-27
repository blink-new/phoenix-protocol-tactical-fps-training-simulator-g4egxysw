import { Weapon, TrainingLevel, Achievement } from '../types/game';

export const weapons: Weapon[] = [
  {
    id: 'glock17',
    name: 'Glock 17',
    type: 'pistol',
    damage: 35,
    accuracy: 85,
    fireRate: 400,
    reloadTime: 2.5,
    ammoCapacity: 17,
    unlockLevel: 1,
    description: 'Standard issue 9mm pistol. Reliable and accurate for basic training.'
  },
  {
    id: 'm4a1',
    name: 'M4A1 Carbine',
    type: 'rifle',
    damage: 55,
    accuracy: 90,
    fireRate: 700,
    reloadTime: 3.1,
    ammoCapacity: 30,
    unlockLevel: 5,
    description: 'Military assault rifle with excellent range and stopping power.'
  },
  {
    id: 'barrett',
    name: 'Barrett M82',
    type: 'sniper',
    damage: 95,
    accuracy: 98,
    fireRate: 60,
    reloadTime: 4.2,
    ammoCapacity: 10,
    unlockLevel: 10,
    description: 'High-powered sniper rifle for precision long-range engagements.'
  }
];

export const trainingLevels: TrainingLevel[] = [
  {
    id: 'basic1',
    name: 'Basic Training I',
    description: '5 static targets, 30 seconds',
    targetCount: 5,
    timeLimit: 30,
    difficulty: 'easy',
    targetTypes: ['static'],
    effects: [],
    unlockLevel: 1
  },
  {
    id: 'basic2',
    name: 'Basic Training II',
    description: '8 mixed targets, 45 seconds',
    targetCount: 8,
    timeLimit: 45,
    difficulty: 'medium',
    targetTypes: ['static', 'moving'],
    effects: [],
    unlockLevel: 2
  },
  {
    id: 'advanced1',
    name: 'Advanced Training',
    description: '12 targets with distractions',
    targetCount: 12,
    timeLimit: 60,
    difficulty: 'hard',
    targetTypes: ['static', 'moving'],
    effects: ['smoke', 'flash'],
    unlockLevel: 3
  }
];

export const achievements: Achievement[] = [
  {
    id: 'marksman',
    name: 'Marksman',
    description: 'Achieve 90% accuracy in a training session',
    icon: '🎯',
    unlocked: false
  },
  {
    id: 'speed_shooter',
    name: 'Speed Shooter',
    description: 'Complete a level in under 20 seconds',
    icon: '⚡',
    unlocked: false
  },
  {
    id: 'perfect_accuracy',
    name: 'Perfect Accuracy',
    description: 'Hit all targets without missing',
    icon: '💯',
    unlocked: false
  },
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Complete your first training session',
    icon: '🩸',
    unlocked: false
  },
  {
    id: 'weapon_master',
    name: 'Weapon Master',
    description: 'Unlock all weapons',
    icon: '🔫',
    unlocked: false
  }
];

export const defaultPlayer = {
  id: 'phoenix',
  name: 'Marcus "Phoenix" Rivera',
  level: 1,
  experience: 0,
  unlockedWeapons: ['glock17'],
  achievements: achievements.map(a => ({ ...a })),
  stats: {
    totalShots: 0,
    totalHits: 0,
    accuracy: 0,
    bestTime: 0,
    highestScore: 0,
    gamesPlayed: 0
  }
};