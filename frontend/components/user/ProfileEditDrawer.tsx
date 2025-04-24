/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { UserDTO } from '@/types/User'
import { Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerTrigger 
} from '@/components/ui/drawer'
import ProfileEditForm from './ProfileEditForm'

interface ProfileEditDrawerProps {
  user: UserDTO
}

const ProfileEditDrawer = ({ user }: ProfileEditDrawerProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className=" cursor-pointer absolute top-4 right-4 flex items-center gap-1 bg-primary-color text-white hover:bg-primary-color/90 hover:text-white shadow-md hover:shadow-lg transition-all"
        >
          <Edit className="h-4 w-4" />
          <span className="hidden sm:inline">Edit Profile</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4 max-w-[95vw] sm:max-w-lg mx-auto rounded-t-xl">
        <DrawerHeader className="px-4">
          <DrawerTitle className="text-xl font-bold text-center">Edit Your Profile</DrawerTitle>
          <DrawerDescription className="text-center">
            Make changes to your profile information here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileEditForm user={user} />
        <DrawerFooter className="pt-2 px-4">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default ProfileEditDrawer