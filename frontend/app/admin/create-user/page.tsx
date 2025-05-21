"use client"

import { CreateExternalAuditorForm } from "@/components/admin/CreateExternalAuditorForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/AuthContext"
import { useLanguage } from "@/lib/LanguageContext"
import { redirect } from "next/navigation"

export default function CreateExternalAuditorPage() {
  const { user } = useAuth()
  const { t } = useLanguage()

  // Only allow admin users to access this page
  if (!user || user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl font-bold text-primary-color mb-6">
        {t("admin.createUser.title")}
      </h1>
      <Card className="shadow-lg border-primary-color/20">
        <CardHeader className="bg-secondary-color/5">
          <CardTitle className="text-primary-color">
            {t("admin.createUser.cardTitle")}
          </CardTitle>
          <CardDescription>
            {t("admin.createUser.cardDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <CreateExternalAuditorForm />
        </CardContent>
      </Card>
    </div>
  )
}