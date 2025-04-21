import { useState } from "react";
import { User } from "@/types/User";
import { useAuth } from "@/lib/AuthContext";
import { environment } from "@/env/environment.dev";
import { ResponseDTO } from "@/types/ResponseDTO";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthUser, token } = useAuth();

  const registerUser = async (user: User) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${environment.API_URL}/users/api/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        throw new Error("Failed to register user");
      }

      const newUser: ResponseDTO<User> = await res.json();
      
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(newUser.data));
      
      // Update auth context
      setAuthUser(newUser.data);
      
      return newUser.data;
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerUser,
    isLoading,
    error
  };
};
