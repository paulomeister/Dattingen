"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserInput } from "./UserInput";
import { RoleSelector } from "./RoleSelector";
import { User } from "@/types/User";

interface RegisterFormProps {
  onSuccess: (user: User) => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User>({
    authId: null,
    username: "",
    name: "",
    email: "",
    role: "InternalAuditor",
    bussinessId: null,
  });

  const handleChange = (field: keyof User, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(user);
    }, 1000);
  };

  return (
    <Card className="border-[#14213d]">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          <UserInput
            id="username"
            label="Username"
            value={user.username}
            onChange={(v) => handleChange("username", v)}
            placeholder="Choose a username"
          />
          <UserInput
            id="name"
            label="Full Name"
            value={user.name}
            onChange={(v) => handleChange("name", v)}
            placeholder="Enter your full name"
          />
          <UserInput
            id="email"
            label="Email"
            type="email"
            value={user.email}
            onChange={(v) => handleChange("email", v)}
            placeholder="Enter your email"
          />
          <RoleSelector
            value={user.role}
            onChange={(v) => handleChange("role", v)}
          />
          <UserInput
            id="password"
            label="Password"
            type="password"
            value=""
            onChange={() => {}}
            placeholder="Create a password"
          />
          <UserInput
            id="confirm-password"
            label="Confirm Password"
            type="password"
            value=""
            onChange={() => {}}
            placeholder="Confirm your password"
          />
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-[#fca311] text-[#000814] hover:bg-[#e5940f]"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
