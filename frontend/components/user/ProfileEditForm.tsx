"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { useAuth } from "@/lib/AuthContext"
import { useLanguage } from "@/lib/LanguageContext"
import { environment } from "@/env/environment.dev"
import { UserDTO } from "@/types/User"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  language: z.enum(["en", "es", "fr"], {
    required_error: "Please select a language.",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface ProfileEditFormProps {
  user: UserDTO
}

const ProfileEditForm = ({ user }: ProfileEditFormProps) => {
  const { setLanguage } = useLanguage()
  const { setAuthUser, token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      language: user.language as "en" | "es",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)

    try {
      // Create updated user object
      const updatedUser = {
        name: values.name,
        language: values.language,
      }

      // Make API call to update user
      const response = await fetch(`${environment.API_URL}/users/api/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(updatedUser),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const result = await response.json()

      // Update the language context if language was changed
      if (values.language !== user.language) {
        setLanguage(values.language)
      }

      // Update the auth context with new user data
      setAuthUser(result.data)

      // Save updated user to localStorage
      localStorage.setItem('user', JSON.stringify(result.data))

      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-4 py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your name" 
                    {...field} 
                    className="shadow-sm focus:ring-2 focus:ring-primary-color/30"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Language</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="shadow-sm focus:ring-2 focus:ring-primary-color/30">
                      <SelectValue placeholder="Select your preferred language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-primary-color hover:bg-primary-color/90 text-white py-2 rounded-md shadow-md hover:shadow-lg transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ProfileEditForm