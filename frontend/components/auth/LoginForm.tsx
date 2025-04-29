"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/AuthContext"
import { UserDTO } from "@/types/User"
import { useRouter } from "next/navigation"

export function LoginForm() {

  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { setAuthUser, setToken } = useAuth()

  // Predefined users matching the UserDTO interface
  const adminUser: UserDTO = {
    _id: "6809846f94947a3f4e3946c4",
    username: "admin",
    name: "admin",
    language: "en",
    role: "Admin", // Using proper RoleEnum value
    businessId: "680b0a0db3f93a7e7c7c2c0c",
  }

  const regularUser: UserDTO = {
    _id: "6805419d5491f7412b319771",
    username: "sahv",
    name: "Sergio Herrera",
    language: "en",
    role: "ExternalAuditor", // Using proper RoleEnum value
    businessId: null, // Changed from empty string to null to match UserDTO interface
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Authentication logic based on email
      if (email === "admin@gmail.com" && password === "password") {
        // Authenticate as admin
        setAuthUser(adminUser)
        localStorage.setItem("user", JSON.stringify(adminUser))
        setToken("fake-admin-token-123")
        router.push("/")// TODO QUITAR

      } else if (email === "sergio@gmail.com" && password === "password") {
        // Authenticate as regular user
        setAuthUser(regularUser)
        localStorage.setItem("user", JSON.stringify(regularUser))
        setToken("fake-user-token-456")
        router.push("/") // TODO QUITAR
      } else {
        setError("Invalid email or password")
      }
    } catch (error) {
      setError("An error occurred during login")
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-[#14213d] shadow-2xl">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm font-medium">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary-color">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                className="border-primary-color focus-visible:ring-primary-color"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-primary-color">
                  Password
                </Label>
                <a href="#" className="text-sm text-primary-color hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                className="border-primary-color focus-visible:ring-primary-color"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-5">
          <Button type="submit" className="w-full bg-secondary-color text-white cursor-pointer hover:bg-primary-color" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
