"use client";

import { Business } from "@/types/Business";
import { Card } from "@/components/ui/card";
import { Users, Building2, FileText } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

interface BusinessItemProps {
    business: Business;
}

export default function BusinessItem({ business }: BusinessItemProps) {
    const { t } = useLanguage();

    return (
        <Link
            href={`/business/${business._id}`}
            className="block transition-transform duration-300 hover:scale-102 focus:outline-none"
        >
            <Card className="p-6 h-full border border-gray-200 hover:border-primary-color hover:shadow-md transition-all duration-300">
                <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-primary-color/10 flex items-center justify-center mr-4">
                        <Building2 className="h-6 w-6 text-primary-color" />
                    </div>
                    <div className="">
                        <h3 className="text-xl font-medium text-gray-900">{business.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 ">{business.activity.slice(0, 30) + "..."}</p>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                        <Users className="h-5 w-5 text-secondary-color mr-2" />
                        <span className="text-sm font-medium">
                            {business.associates.length} {t("business.associates.title")}
                        </span>
                    </div>

                    <div className="flex items-center">
                        <FileText className="h-5 w-5 text-secondary-color mr-2" />
                        <span className="text-sm font-medium">
                            {business?.audits?.length} {t("business.audits")}
                        </span>
                    </div>
                </div>
            </Card>
        </Link>
    );
}