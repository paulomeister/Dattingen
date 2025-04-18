import { AuthTabs } from "@/components/auth/AuthTabs";
import React from "react";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e5e5e5] p-4">
      <AuthTabs />
    </div>
  );
};

export default LoginPage;
