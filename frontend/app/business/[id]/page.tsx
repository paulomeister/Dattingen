import { Metadata } from "next";
import { environment } from "@/env/environment.dev";
import { Business } from "@/types/Business";
import BusinessDetail from "@/components/business/BusinessDetail";
import { Bus } from "lucide-react";

type BusinessPageProps = {
    params: {
        id: string;
    };
};

export const metadata: Metadata = {
    title: "Business Details | ACME Audits",
    description: "View and manage your business details",
};

// This is a React Server Component that fetches the data
export default async function BusinessPage({ params }: BusinessPageProps) {
    const { id } = await params;

    // Server-side API request to fetch business data
    const response = await fetch(
        `${environment.API_URL}/businesses/api/${id}`,
        {
            cache: "no-store", // Don't cache this data
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    const responseStats = await fetch(
        `${environment.API_URL}/businesses/api/statistics/audits/${id}`,
        {
            cache: "no-store", // Don't cache this data
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    // Handle errors
    if (!response.ok || !responseStats.ok) {
        console.error(`Failed to fetch business data: 1. ${response.statusText}\n or 2. ${responseStats.statusText}`);
    }

    const data = await response.json();
    const dataStats = await responseStats.json();
    const business: Business = data.data;
    business.stats = dataStats.data;

    console.log("Business data:", business);

    
    return (
        <div className="mx-1 px-4">
            <BusinessDetail business={business} />
        </div>
    );
}