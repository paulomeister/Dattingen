"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useSearchParams } from "next/navigation";
import { Business } from "@/types/Business";
import { environment } from "@/env/environment.dev";
import BusinessItem from "./BusinessItem";
import { Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function BusinessList() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBusinesses() {
            setLoading(true);
            setError(null);

            try {
                const endpoint = query
                    ? `${environment.API_URL}/businesses/api/search?name=${encodeURIComponent(query)}`
                    : `${environment.API_URL}/businesses/api/`;

                const response = await fetch(endpoint);

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === 200 && data.data) {
                    setBusinesses(data.data);
                } else {
                    setBusinesses([]);
                }
            } catch (err) {
                console.error("Error fetching businesses:", err);
                setError(t("business.page.error.fetch"));
                setBusinesses([]);
            } finally {
                setLoading(false);
            }
        }

        fetchBusinesses();
    }, [query, t]);

    if (loading) {
        return <BusinessListSkeleton />;
    }

    if (error) {
        return (
            <div className="text-center p-8 bg-red-50 rounded-lg">
                <p className="mt-2 text-gray-600">{t("business.page.retry")}</p>
            </div>
        );
    }

    if (businesses.length === 0) {
        return (
            <div className="text-center p-12 bg-gray-50 rounded-lg">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">{t("business.page.emptyTitle")}</h3>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businesses.map((business) => (
                <BusinessItem key={business._id} business={business} />
            ))}
        </div>
    );
}

function BusinessListSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-6 h-full">
                    <div className="flex items-start">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 ml-4">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3 mt-1" />
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}