import React from 'react'
import { User, Award, Target } from 'lucide-react'

interface UserProfileProps {
  avatar: string | null
  playerStats: {
    level: number
    totalScore: number
    accuracy: number
    achievements: string[]
  }
}

export const UserProfile: React.FC<UserProfileProps> = ({ avatar, playerStats }) => {
  return (
    <div className="absolute top-4 left-4 z-50 bg-black/80 backdrop-blur-sm border border-accent/30 rounded-lg p-3 min-w-[200px]">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-accent/30 overflow-hidden flex items-center justify-center">
          {avatar ? (
            <img 
              src={avatar} 
              alt="Marcus Phoenix Rivera" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-white font-orbitron">Marcus "Phoenix" Rivera</h3>
          <p className="text-xs text-gray-400">Elite Tactical Instructor</p>
        </div>
      </div>
      
      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Level</span>
          <span className="text-accent font-bold">{playerStats.level}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Score</span>
          <span className="text-white">{playerStats.totalScore.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Accuracy</span>
          <span className="text-white">{playerStats.accuracy.toFixed(1)}%</span>
        </div>
        
        {playerStats.achievements.length > 0 && (
          <div className="pt-2 border-t border-gray-700">
            <div className="flex items-center gap-1 mb-1">
              <Award className="w-3 h-3 text-accent" />
              <span className="text-xs text-gray-400">Latest Achievement</span>
            </div>
            <div className="text-xs text-accent font-medium">
              {playerStats.achievements[playerStats.achievements.length - 1]}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}