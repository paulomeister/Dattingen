import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ProfileErrorProps {
  error: string
}

const ProfileError = ({ error }: ProfileErrorProps) => {
  const router = useRouter()
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Error Loading Profile</h2>
        </CardHeader>
        <CardContent className="text-center p-6">
          <p className="mb-6 text-gray-600 dark:text-gray-300">{error}</p>
          <Button 
            className="bg-primary-color hover:bg-primary-color/90 text-white transition-all shadow-md hover:shadow-lg"
            onClick={() => router.push('/')}
          >
            Return Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileError