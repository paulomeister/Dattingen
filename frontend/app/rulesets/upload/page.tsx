"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X, ArrowUp } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import RulesetForm from "@/components/normatives/RulesetForm"; // Asegúrate de importar tu formulario aquí.
import Link from "next/link";
import { Ruleset } from "@/types/Ruleset";
import { useApiClient } from "@/hooks/useApiClient";
import { useLanguage } from "@/lib/LanguageContext";

export default function CreateNormativesPage() {
  const { t } = useLanguage();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fileConfirmed, setFileConfirmed] = useState(false); // Estado para confirmar el archivo cargado
  const router = useRouter();
  const apiClient = useApiClient();
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      setDrawerOpen(false);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setFileConfirmed(false);
  };

  const handleCancelFile = () => {
    resetUpload();
    setDrawerOpen(true); // Reabrir el drawer para permitir subir otro archivo
  };

  const handleSave = async (data: Partial<Ruleset>) => {
    if (uploadedFile && data) {
      try {
        // Subir el archivo usando apiClient.upload
        const formData = new FormData();
        formData.append("file", uploadedFile);
        const dataInfo = await apiClient.upload<{ fileName: string }>(`/rulesets/api/uploadFile`, formData);
        const name: string = dataInfo.fileName;
        const fileName = name.replace("Rulesets/", "");

        // Ahora, usamos los datos del formulario para completar el ruleset
        const completeRulesetData = {
          ...data,  // Los datos que vienen del formulario
          fileName,   // Añadimos el nombre del archivo
        };

        // Usar apiClient.post para crear el ruleset
        const responseData = await apiClient.post<Ruleset, typeof completeRulesetData>(`/rulesets/api/create`, completeRulesetData);

        if (responseData && responseData._id) {
          router.push(`/rulesets/create/${responseData._id}`);
          setFileConfirmed(true);
        } else {
          console.error("Failed to create ruleset");
        }
      } catch (error) {
        console.error("Error confirming file:", error);
      }
    }
  }


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-secondary-color">
              {t("rulesets.upload.title", "Create Ruleset")}
            </h2>
            <p className="text-muted-foreground mt-2">
              {t("rulesets.upload.subtitle", "Upload a file and create a new ruleset.")}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-center mb-6">
              {!uploadedFile && !fileConfirmed ? (
                <>
                  <p className="text-lg text-muted-foreground">{t("rulesets.upload.nothingUploaded", "No file uploaded yet")}</p>
                  <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerTrigger asChild>
                      <Button className="bg-primary-color text-white mt-2 hover:shadow-2xl transition hover:-translate-y-1">
                        {t("rulesets.upload.buttonOpenDrawer", "Upload File")}
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="w-1/2 mx-auto">
                        <DrawerHeader>
                          <DrawerTitle className="text-center text-2xl font-bold text-primary-color">
                            {t("rulesets.upload.drawerTitle", "Upload File")}
                          </DrawerTitle>
                        </DrawerHeader>

                        <div className="relative rounded-lg border border-border bg-background px-6 py-16 shadow-md">
                          <DrawerClose className="absolute top-2 right-2 hover:bg-muted rounded-full p-1">
                            <X className="w-5 h-5" />
                          </DrawerClose>

                          <h3 className="mb-4 text-sm font-medium text-tertiary">
                            {t("rulesets.upload.requirementsTitle", "Requirements for the file")}
                          </h3>
                          <div className="bg-tertiary/10 border border-tertiary rounded-md p-4">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="pdf" />
                                <Label htmlFor="pdf" className="text-sm">{t("rulesets.upload.onlyPdf", "PDF only")}</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="editable" />
                                <Label htmlFor="editable" className="text-sm">{t("rulesets.upload.editable", "Editable")}</Label>
                              </div>
                            </div>
                          </div>

                          <div
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className="mt-6 border-2 border-dashed border-primary/30 bg-primary/5 rounded-lg p-6 text-center transition-all hover:bg-primary/10"
                          >
                            <p className="text-sm text-muted-foreground mb-3">{t("rulesets.upload.dragFile", "Drag your file here")}</p>
                            <div className="inline-flex items-center justify-center bg-muted p-3 rounded-full">
                              <ArrowUp className="w-6 h-6 text-primary" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </>
              ) : fileConfirmed ? (
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">{t("rulesets.upload.confirmTitle", "File Confirmed")}</h3>
                  <p className="text-muted-foreground">{uploadedFile?.name}</p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">{t("rulesets.upload.done", "File Uploaded")}</h3>
                  <p className="text-muted-foreground">{uploadedFile?.name}</p>
                  <Button
                    className="bg-primary-color text-white"
                    onClick={handleCancelFile}
                  >
                    {t("rulesets.upload.goBack", "Upload Another File")}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Formulario para crear un Ruleset */}
          <div className="mt-10">
            <RulesetForm
              onSave={(data) => {
                handleSave(data)
              }}
            />
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/">
              <Button variant="outline" className="text-sm border-primary-color border-opacity-30 text-primary-color hover:bg-primary-color/10">
                {t("rulesets.upload.goBack", "Go Back")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
