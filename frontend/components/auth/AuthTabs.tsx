"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-[#000814]">ACME Audit System</h1>
        <p className="mt-2 text-[#14213d]">
          Login or create an account to continue
        </p>
      </div>

      <Tabs
        defaultValue="login"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 bg-[#14213d]">
          <TabsTrigger
            value="login"
            className="data-[state=active]:bg-[#fca311] data-[state=active]:text-[#000814] text-white"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="data-[state=active]:bg-[#fca311] data-[state=active]:text-[#000814] text-white"
          >
            Register
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm onSuccess={() => {}} />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm onSuccess={() => setActiveTab("login")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
