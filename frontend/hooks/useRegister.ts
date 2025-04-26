import { useState } from "react";
import { User, UserDTO } from "@/types/User";
import { useAuth } from "@/lib/AuthContext";
import { createUser } from "@/lib/utils";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthUser } = useAuth();

  const registerUser = async (user: User): Promise<UserDTO> => {
    setIsLoading(true);
    setError(null);

    try {
      const resDTO = await createUser(user);
      const newUser = resDTO.data as UserDTO;
      // TODO Quitar esto cuando haya autenticación real
      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(newUser));

      // Update auth context
      setAuthUser(newUser);

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
