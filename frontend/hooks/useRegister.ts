import { useState } from "react";
import { User, UserDTO } from "@/types/User";
import { useAuth } from "@/lib/AuthContext";
import { environment } from "@/env/environment.dev";
import { ResponseDTO } from "@/types/ResponseDTO";
import { useRouter } from "next/navigation";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthUser, token } = useAuth();
  const router = useRouter();

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

      const resDTO: ResponseDTO<UserDTO> = await res.json();

      if (resDTO.status in [400, 401, 403]) {
        throw new Error(resDTO.message);
      }

      const newUser = resDTO.data as UserDTO;
      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(newUser));

      // Update auth context
      setAuthUser(newUser);

      // Redirect Coordinator role users to business creation page
      if (resDTO.status === 200 && newUser.role === "Coordinator") {
        router.push("/business/create");
      }

      return newUser;
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerUser,
    isLoading,
    error,
  };
};
