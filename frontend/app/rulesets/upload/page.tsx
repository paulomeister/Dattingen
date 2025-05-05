
"use client"
import Link from "next/link"
import { ArrowUp, X } from "lucide-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/LanguageContext"


export default function CreateNormativesPage() {
  const { t } = useLanguage()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const router = useRouter()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      if (file.type === "application/pdf") {
        setUploadedFile(file)
        setErrorMessage(null) // Clear any previous error
        setDrawerOpen(false)
      } else {
        setErrorMessage(t("Only PDF files are allowed.")) // Set error message
      }
    }
  }

  const resetUpload = () => setUploadedFile(null)

  const handleConfirmFile = () => {
    // TODO handle file upload logic

    // Mandar el archivo a guardar en la base de datos

    // Redirigir a la página de creación de reglas
    router.push("/rulesets/create")

  }


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-secondary-color">
              {t("rulesets.upload.title")}
            </h2>
            <p className="text-muted-foreground mt-2">
              {t("rulesets.upload.description")}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-center mb-6">
              {!uploadedFile ? (
                <>
                  <p className="text-lg text-muted-foreground">
                    {t("rulesets.upload.nothingUploaded")}
                  </p>
                  <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerTrigger asChild>
                      <Button className="bg-primary-color text-white mt-2 hover:shadow-2xl transition hover:-translate-y-1">
                        {t("rulesets.upload.buttonOpenDrawer")}
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="w-1/2 mx-auto ">
                        <DrawerHeader>
                          <DrawerTitle className="text-center text-2xl font-bold text-primary-color">
                            {t("rulesets.upload.drawerTitle")}
                          </DrawerTitle>
                        </DrawerHeader>

                        <div className="relative rounded-lg border border-border bg-background px-6 py-16 shadow-md">
                          <DrawerClose className="absolute top-2 right-2 hover:bg-muted rounded-full p-1">
                            <X className="w-5 h-5" />
                          </DrawerClose>

                          <h3 className="mb-4 text-sm font-medium text-tertiary">
                            {t("rulesets.upload.requirementsTitle")}
                          </h3>
                          <div className="bg-tertiary/10 border border-tertiary rounded-md p-4">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="pdf" />
                                <Label htmlFor="pdf" className="text-sm">
                                  {t("rulesets.upload.onlyPdf")}
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="editable" />
                                <Label htmlFor="editable" className="text-sm">
                                  {t("rulesets.upload.editable")}
                                </Label>
                              </div>
                            </div>
                          </div>

                          <div
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className="mt-6 border-2 border-dashed border-primary/30 bg-primary/5 rounded-lg p-6 text-center transition-all hover:bg-primary/10"
                          >
                            <p className="text-sm text-muted-foreground mb-3">
                              {t("rulesets.upload.dragFile")}
                            </p>
                            <div className="inline-flex items-center justify-center bg-muted p-3 rounded-full">
                              <ArrowUp className="w-6 h-6 text-primary" />
                            </div>
                          </div>

                          <DrawerFooter className="mt-6 flex justify-center gap-4">
                            <Button className="bg-primary-color text-white hover:shadow-md transition">
                              {t("rulesets.upload.done")}
                            </Button>
                            <DrawerClose asChild>
                              <Button variant="outline">
                                {t("rulesets.upload.cancel")}
                              </Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </div>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">
                    {t("rulesets.upload.confirmTitle")}
                  </h3>
                  <p className="text-muted-foreground">{uploadedFile.name}</p>
                  <div className="flex justify-center gap-4 mt-4">
                    <Button
                      className="bg-primary-color text-white"
                      onClick={handleConfirmFile}
                    >
                      {t("rulesets.upload.yes")}
                    </Button>
                    <Button variant="outline" onClick={resetUpload}>
                      {t("rulesets.upload.no")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/">
              <Button
                variant="outline"
                className="text-sm border-primary-color border-opacity-30 text-primary-color hover:bg-primary-color/10"
              >
                {t("rulesets.upload.goBack")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}