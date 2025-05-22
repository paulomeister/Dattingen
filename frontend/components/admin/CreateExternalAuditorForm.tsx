"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormInputField, FormSelectField } from "@/components/ui/form-fields"
import toast from "react-hot-toast"
import { useLanguage } from "@/lib/LanguageContext"
import { Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { environment } from "@/env/environment.dev"

// Form schema with validation
const formSchema = z.object({
    username: z.string().min(3, {
        message: "Username must be at least 3 characters",
    }),
    name: z.string().min(2, {
        message: "Name must be at least 2 characters",
    }),
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters",
    }),
    language: z.enum(["en", "es"], {
        required_error: "Please select a language",
    }),
})

type FormValues = z.infer<typeof formSchema>;

export function CreateExternalAuditorForm() {
    // TODO no sé si se usa acá el token más adelante!
    const { t } = useLanguage()
    const [success, setSuccess] = useState(false)

    // Initialize form with default values
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            name: "",
            email: "",
            password: "",
            language: "en",
        },
    })

    // Handle form submission
    async function onSubmit(values: FormValues) {
        try {
            setSuccess(false)

            // Construir el objeto de registro igual que RegisterForm
            const userRegister = {
                ...values,
                role: "ExternalAuditor",
                securityQuestion: {
                    securityQuestion: "What is your favorite color?",
                    securityAnswer: "blue"
                }
            };

            // Enviar como FormData al endpoint de RegisterForm
            const formData = new FormData();
            formData.append('incomingString', JSON.stringify(userRegister));
            const response = await fetch(`${environment.API_URL}/security/api/signup`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setSuccess(true);
                form.reset();
                toast.success(t("admin.createUser.toast.success"));
            } else {
                const errorText = await response.text();
                console.error(errorText);
                toast.error(t("admin.createUser.toast.error"));
            }
        } catch (err) {
            console.error("Error creating external auditor:", err);
            toast.error(t("admin.createUser.toast.error"));
        }
    }

    // Create language options for the select field
    const languageOptions = [
        { value: "en", label: t("admin.createUser.form.language.options.english") },
        { value: "es", label: t("admin.createUser.form.language.options.spanish") },
    ]

    return (
        <Form {...form}>


            {success && (
                <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertTitle>{t("admin.createUser.alerts.success.title")}</AlertTitle>
                    <AlertDescription>{t("admin.createUser.alerts.success.description")}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInputField
                        form={form}
                        name="username"
                        label={t("admin.createUser.form.username.label")}
                        placeholder={t("admin.createUser.form.username.placeholder")}
                        description={t("admin.createUser.form.username.description")}
                    />

                    <FormInputField
                        form={form}
                        name="name"
                        label={t("admin.createUser.form.name.label")}
                        placeholder={t("admin.createUser.form.name.placeholder")}
                        description={t("admin.createUser.form.name.description")}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInputField
                        form={form}
                        name="email"
                        type="email"
                        label={t("admin.createUser.form.email.label")}
                        placeholder={t("admin.createUser.form.email.placeholder")}
                        description={t("admin.createUser.form.email.description")}
                    />

                    <FormInputField
                        form={form}
                        name="password"
                        type="password"
                        label={t("admin.createUser.form.password.label")}
                        placeholder={t("admin.createUser.form.password.placeholder")}
                        description={t("admin.createUser.form.password.description")}
                    />
                </div>

                <FormSelectField
                    form={form}
                    name="language"
                    label={t("admin.createUser.form.language.label")}
                    description={t("admin.createUser.form.language.description")}
                    options={languageOptions}
                />

                <div className="pt-4 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    <Button
                        type="submit"
                        className="w-full bg-secondary-color hover:bg-primary-color text-white transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        {t("admin.createUser.form.submit.label")}
                    </Button>
                </div>
            </form>
        </Form>
    )
}