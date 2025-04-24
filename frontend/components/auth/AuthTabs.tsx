"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useLanguage } from "@/lib/LanguageContext";

export function AuthTabs() {
  const baseJSON = "auth.tabs"
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("login");


  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-black">
          {t(`auth.tabs.title`)}
        </h1>
        <p className="mt-2 text-slate-800">
          {t(`${baseJSON}.subtitle`)}
        </p>
      </div>

      <Tabs
        defaultValue="login"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 bg-black rounded-xl">
          <TabsTrigger
            value="login"
            className="data-[state=active]:bg-secondary-color rounded-xl cursor-pointer text-white"
          >
            {t(`${baseJSON}.login`)}
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="data-[state=active]:bg-secondary-color rounded-xl cursor-pointer  text-white"
          >
            {t(`${baseJSON}.register`)}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm  />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm  />
        </TabsContent>
      </Tabs>
    </div>
  );
}
