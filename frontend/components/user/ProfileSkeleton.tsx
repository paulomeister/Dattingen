import React from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const ProfileSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="w-full overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2 flex-1 text-center sm:text-left">
            <Skeleton className="h-8 w-40 mx-auto sm:mx-0" />
            <Skeleton className="h-6 w-24 mx-auto sm:mx-0" />
            <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileSkeleton