"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { Ruleset } from "@/types/Ruleset";
import { useAuth } from "@/lib/AuthContext";

interface Props {
    onSave: (data: Ruleset) => void;
}

export default function RulesetForm({ onSave }: Props) {


    const { user } = useAuth()


    const { register, handleSubmit, formState: { errors } } = useForm<Ruleset>({
        defaultValues: {
            version: "",
            name: "",
            organization: "",
            publishingDate: new Date(),
            status: "draft", // Definir un valor por defecto
            controls: []
        }
    });

    const onSubmit = (data: Ruleset) => {
        onSave(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-lg p-6 shadow-lg">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="name" className="text-sm font-medium text-primary-color">Ruleset Name</Label>
                    <Input
                        id="name"
                        {...register("name", { required: "Name is required" })}
                        placeholder="Enter ruleset name"
                        className={`border-tertiary-color/30 focus:border-primary-color/50 focus:ring-primary-color/20 transition-all
                        ${errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                    <Label htmlFor="version" className="text-sm font-medium text-primary-color">Version</Label>
                    <Input
                        id="version"
                        {...register("version", { required: "Version is required" })}
                        placeholder="Enter version"
                        className={`border-tertiary-color/30 focus:border-primary-color/50 focus:ring-primary-color/20 transition-all
                        ${errors.version ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
                    />
                    {errors.version && <p className="text-sm text-red-500">{errors.version.message}</p>}
                </div>

                <div>
                    <Label htmlFor="organization" className="text-sm font-medium text-primary-color">Organization</Label>
                    <Input
                        id="organization"
                        {...register("organization", { required: "Organization is required" })}
                        placeholder="Enter organization name"
                        className={`border-tertiary-color/30 focus:border-primary-color/50 focus:ring-primary-color/20 transition-all
                        ${errors.organization ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
                    />
                    {errors.organization && <p className="text-sm text-red-500">{errors.organization.message}</p>}
                </div>

                <div>
                    <Label htmlFor="status" className="text-sm font-medium text-primary-color">Status</Label>
                    <Select {...register("status", { required: "Status is required" })}>
                        <SelectTrigger className="focus:ring-primary-color/50 focus:border-primary-color/30">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem className="bg-white" value={user?.language === "es" ? "borrador" : "draft"}>{user?.language === "es" ? "Borrador" : "Draft"}</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
                </div>



            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" className="bg-primary-color hover:bg-primary-color/90 text-white shadow-md transition-all">
                    Save Ruleset
                </Button>
            </div>
        </form>
    );
}
