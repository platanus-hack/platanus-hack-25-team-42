import * as React from 'react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '../avatar'
import { Button } from '../button'
import type { LucideIcon } from 'lucide-react'
import { Key, Plus, Shield } from 'lucide-react'
import { authClient } from '@/integrations/auth/client'

interface SidebarProfileProps {
  name: string
  id?: string
  image?: string
  fallback?: string
  badge?: {
    icon: LucideIcon | React.ElementType
    className?: string
  }
  className?: string
}

export function SidebarProfile({
  name,
  id,
  image,
  fallback,
  badge,
  className,
}: SidebarProfileProps) {
  const BadgeIcon = badge?.icon
  const [isCreatingPasskey, setIsCreatingPasskey] = React.useState(false)
  const [passkeyStatus, setPasskeyStatus] = React.useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState<string>('')

  const handleCreatePasskey = async () => {
    setIsCreatingPasskey(true)
    setPasskeyStatus('idle')
    setErrorMessage('')
    
    try {
      const result = await authClient.passkey.addPasskey({
        name: `${name}'s Passkey - ${new Date().toLocaleDateString()}`,
      })
      
      if (result.error) {
        throw new Error(result.error.message || 'Failed to create passkey')
      }
      
      setPasskeyStatus('success')
    } catch (error) {
      setPasskeyStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create passkey')
    } finally {
      setIsCreatingPasskey(false)
    }
  }

  return (
    <div className={cn("flex flex-col items-center text-center border-b border-gray-200/50 pb-6", className)}>
      <div className="relative mb-4">
        <Avatar className="w-20 h-20 border-2 border-white/50 shadow-lg">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{fallback || name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        {BadgeIcon && (
          <div className={cn(
            "absolute -right-2 -bottom-2 bg-gradient-to-tr from-blue-600 to-cyan-400 p-1.5 rounded-full border-2 border-white/50 shadow-md",
            badge.className
          )}>
            <BadgeIcon size={14} className="text-white fill-white" />
          </div>
        )}
      </div>
      <div className="w-full">
        <h2 className="text-lg font-bold text-gray-900">{name}</h2>
        {id && (
          <p className="text-xs text-gray-500 mt-1">ID: {id}</p>
        )}
      </div>

      {/* Passkey Section */}
      <div className="w-full mt-4 px-3">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-semibold text-gray-900">Security</h3>
          </div>
          
          <p className="text-xs text-gray-600 mb-3">
            Add a passkey for secure, passwordless authentication
          </p>

          <Button
            onClick={handleCreatePasskey}
            disabled={isCreatingPasskey}
            size="sm"
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white"
          >
            {isCreatingPasskey ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" />
                <Key className="w-3 h-3" />
                <span>Add Passkey</span>
              </>
            )}
          </Button>

          {passkeyStatus === 'success' && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Passkey created successfully!</span>
            </div>
          )}

          {passkeyStatus === 'error' && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

