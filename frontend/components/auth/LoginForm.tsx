"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { environment } from "@/env/environment.dev";


export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { setAuthUser, setToken } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {

      const body = new URLSearchParams();
      body.append('username', email);
      body.append('password', password);

      const response = await fetch('http://localhost:8084/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: '<cambiar>', password: '<cambiar>' })
      });

      if (response.ok) {

        console.log(response)

        const token = response.headers.get('Authorization');
        if (token) {
          setToken(token);
          localStorage.setItem('token', token);
          // Si tu backend retorna el usuario en el body, puedes hacer:
          // const user = await response.json();
          // setAuthUser(user);
          toast.success("¡Inicio de sesión exitoso!");
          router.push('/');
        } else {
          setError('No se recibió token de autenticación');
          toast.error('No se recibió token de autenticación');
        }
      } else {
        setError('Credenciales inválidas');
        toast.error('Credenciales inválidas');
      }
    } catch (err) {
      setError('Error en el login');
      toast.error('Error en el login');
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
