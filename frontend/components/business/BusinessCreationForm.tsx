"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { environment } from "@/env/environment.dev";
import { AssociateRole, Business } from "@/types/Business";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

// Form schema validation
const formSchema = z.object({
    name: z.string().min(3, { message: "Business name must be at least 3 characters" }),
    activity: z.string().min(10, { message: "Please provide a detailed activity description" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function BusinessCreationForm() {
    const router = useRouter();
    const { user, token } = useAuth();
    const { t } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            activity: "",
        },
    });

    // Handle form submission
    const onSubmit = async (values: FormValues) => {

        setIsSubmitting(true);

        try {
            // Create the business object
            const business: Partial<Business> = {
                name: values.name,
                activity: values.activity,
                associates: [{
                    _id: user!._id!,
                    role: user!.role as AssociateRole,
                }],
                audits: []
            };

            // Send API request to create business
            const response = await fetch(`${environment.API_URL}/businesses/api/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token!,
                },
                body: JSON.stringify(business),
            });

            if (!response.ok) {
                throw new Error("Failed to create business");
            }

            const result = await response.json();

            if (result.status >= 400) {
                throw new Error(result.message || "Failed to create business");
            }

            toast.success(t("business.create.success"))

            // Redirect to dashboard or business page
            router.push('/');
        } catch (error) {
            console.error("Error creating business:", error);
            toast.error(t("business.create.error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="border-2 shadow-lg rounded-lg overflow-hidden">
            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            {/* Business Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary-color font-semibold">{t("business.create.name")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t("business.create.namePlaceholder")}
                                                {...field}
                                                className="border-[#14213d] focus-visible:ring-secondary-color"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Business Activity */}
                            <FormField
                                control={form.control}
                                name="activity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-primary-color font-semibold">{t("business.create.activity")}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t("business.create.activityPlaceholder")}
                                                {...field}
                                                className="min-h-[120px] resize-none border-[#14213d] focus-visible:ring-secondary-color"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary-color hover:bg-primary-color/90 text-white py-2 rounded-md shadow-md hover:shadow-lg transition-all"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create Business"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}