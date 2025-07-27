import React, { useState, useRef } from 'react'
import { Upload, User, X } from 'lucide-react'
import { Button } from './ui/button'

interface AvatarUploadProps {
  onAvatarChange: (avatarUrl: string | null) => void
  currentAvatar: string | null
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ onAvatarChange, currentAvatar }) => {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setIsUploading(true)

    // Create a FileReader to convert image to base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      onAvatarChange(result)
      setIsUploading(false)
    }
    reader.onerror = () => {
      alert('Error reading file')
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveAvatar = () => {
    onAvatarChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-accent/30 overflow-hidden flex items-center justify-center">
          {currentAvatar ? (
            <img 
              src={currentAvatar} 
              alt="User Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-gray-400" />
          )}
        </div>
        
        {currentAvatar && (
          <button
            onClick={handleRemoveAvatar}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        )}
      </div>

      <Button
        onClick={handleUploadClick}
        disabled={isUploading}
        variant="outline"
        size="sm"
        className="bg-gray-800/50 border-accent/30 text-accent hover:bg-accent/10"
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? 'Uploading...' : currentAvatar ? 'Change' : 'Upload'}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}