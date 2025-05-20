"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const RulesetsPage = () => {

  const { user } = useAuth();

  // TODO Falta Multilingual
  // TODO Falta hacer el servicio de auditoría para que funcione el botón de Roll in

  const { t } = useLanguage()
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(user?.role === "admin")
  }, [user])

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)]">
      <div className="flex items-center justify-center flex-col py-10 px-5 text-center">
        <h1 className="text-4xl font-bold text-primary-color mb-3">{t("rulesets.rulesets")}</h1>
        <p className="text-muted-foreground max-w-2xl">{t("rulesets.paragraph")}</p>
        <p className="text-muted-foreground max-w-2xl mt-2">{t("rulesets.paragraph2")}</p>
      </div>

      <div className="flex-grow flex items-center justify-center px-4 py-6">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3 w-full max-w-6xl">

          {isAdmin ? (
            // Admin ve ambas tarjetas
            <>
              <Link href="/rulesets/upload" className="cursor-pointer col-span-1">
                <Card className="h-full rounded-2xl border-none bg-white dark:bg-neutral-900 
                  hover:scale-[1.02] transition-transform duration-300 
                  shadow-[0_4px_20px_0_var(--tw-shadow-color)] shadow-secondary-color/30
                  overflow-hidden">
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src="/images/createRuleset.jpg"
                      alt="Create Ruleset"
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="absolute inset-0 bg-primary-color/40 mix-blend-multiply"></div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-secondary-color">
                      {t("rulesets.createRuleset")}
                    </CardTitle>
                    <hr className="h-0.5 border-t-0 bg-secondary-color/40" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {t("rulesets.descriptionCreate")}
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/rulesets/list" className="md:col-span-2 col-span-1">
                <Card className="h-full rounded-2xl border-none bg-white dark:bg-neutral-900 
                  hover:scale-[1.03] transition-transform duration-300
                  shadow-[0_6px_30px_0_var(--tw-shadow-color)] shadow-primary-color/40
                  overflow-hidden">
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src="/images/browseRuleset.jpg"
                      alt="Browse Rulesets"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="absolute inset-0 bg-primary-color/40 mix-blend-multiply"></div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary-color">
                      {t("rulesets.browseRulesets")}
                    </CardTitle>
                    <hr className="h-0.5 border-t-0 bg-primary-color/40" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-base">
                      {t("rulesets.descriptionBrowse")}
                    </p>
                    <p className="mt-2 text-sm text-primary-color font-medium">
                      {t("rulesets.clickToBrowse")}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </>
          ) : (
            // Usuario no admin solo ve una tarjeta expandida
            <div className="col-span-1 md:col-span-3">
              <Link href="/rulesets/list" className="block">
                <Card className="rounded-2xl border-none bg-white dark:bg-neutral-900 
                  hover:scale-[1.01] transition-transform duration-300
                  shadow-[0_6px_30px_0_var(--tw-shadow-color)] shadow-primary-color/40
                  overflow-hidden">
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src="/images/browseRuleset.jpg"
                      alt="Browse Rulesets"
                      layout="fill"
                      objectFit="cover"
                      className="object-center"
                    />
                    <div className="absolute inset-0 bg-primary-color/40 mix-blend-multiply"></div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-primary-color">
                      {t("rulesets.browseRulesets")}
                    </CardTitle>
                    <hr className="h-0.5 border-t-0 bg-primary-color/40" />
                  </CardHeader>
                  <CardContent className="py-6">
                    <p className="text-muted-foreground text-lg max-w-3xl">
                      {t("rulesets.descriptionBrowse")}
                    </p>
                    <p className="mt-4 text-base text-primary-color font-medium">
                      {t("rulesets.clickToBrowse")}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RulesetsPage;
