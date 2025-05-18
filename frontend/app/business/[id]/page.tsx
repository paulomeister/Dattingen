/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import BusinessDetail from "@/components/business/BusinessDetail";
import { useApiClient } from "@/hooks/useApiClient";
import { ResponseDTO } from "@/types/ResponseDTO";
import { Business } from "@/types/Business";
import { StatisticsData } from "@/types/statistics";


export default function BusinessClientPage() {
    const apiClient = useApiClient();

    const { id } = useParams();
    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // Usa tus funciones de cliente API
                const businessData: ResponseDTO<Business> = await apiClient.get(`/businesses/api/${id}`);
                const statsData: StatisticsData = await apiClient.get(`/businesses/api/statistics/audits/681b6aa224f4b90209c40a1e`);


                const business: Business = businessData.data;
                business.stats = statsData;
                setBusiness(business);
            } catch (err: unknown) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!business) return <p>No data found</p>;

    return (
        <div className="mx-1 px-4">
            <BusinessDetail business={business} />
        </div>
    );
}