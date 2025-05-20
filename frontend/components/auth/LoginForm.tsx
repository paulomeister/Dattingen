"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { environment } from "@/env/environment.dev";
import { useLanguage } from "@/lib/LanguageContext"
import { ResponseDTO } from "@/types/ResponseDTO"
import { UserDTO } from "@/types/User"


export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { setAuthUser, setToken } = useAuth()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {

      const response = await fetch(`${environment.API_URL}/security/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });


      const token = response.headers.get('Authorization');
      if (token) {

        try {

          const userResponse: Response = await fetch(`${environment.API_URL}/users/api/search?username=${username}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            }
          });
          const response: ResponseDTO<UserDTO> = await userResponse.json();
          const user = response.data;

          setToken(token);
          setAuthUser(user);

          const isFirstTime = JSON.parse(localStorage.getItem('firstTime')!) === "true";



          if (user?.role?.toLowerCase() === 'coordinator' && isFirstTime) {
            localStorage.setItem("firstTime", JSON.stringify("false"));
            return router.push('/business/create');
          }

          toast.success(t("auth.login.loginSuccess"));

        } catch (err) {
          console.error(err)
        }



        router.push('/');
      } else {
        toast.error(t("auth.login.error.invalidCredentials"));
      }
    } catch (e) {
      console.error(e)
      toast.error(t("auth.login.error.serverError"));
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      setAuthUser(JSON.parse(storedUser));
    }
  }, [setAuthUser, setToken]);

  return (
    <Card className="border-[#14213d] shadow-2xl">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-primary-color">
                {t("auth.login.username")}
              </Label>
              <Input
                id="Username"
                placeholder=""
                required
                className="border-primary-color focus-visible:ring-primary-color"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-primary-color">
                  {t("auth.login.password")}

                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="******"
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
