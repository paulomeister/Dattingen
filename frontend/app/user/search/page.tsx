"use client"

import UserSearch from "@/components/user/UserSearch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/LanguageContext"

export default function UserSearchPage() {
  const { t } = useLanguage()

 

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl font-bold text-primary-color mb-6">
        {t("user.search.title")}
      </h1>
      <Card className="shadow-lg border-primary-color/20">
        <CardHeader className="bg-secondary-color/5">
          <CardTitle className="text-primary-color">
            {t("user.search.cardTitle")}
          </CardTitle>
          <CardDescription>
            {t("user.search.cardDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <UserSearch />
        </CardContent>
      </Card>
    </div>
  )
}