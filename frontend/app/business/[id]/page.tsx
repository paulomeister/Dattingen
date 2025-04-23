import { Metadata } from "next";
import { environment } from "@/env/environment.dev";
import { Business } from "@/types/Business";
import BusinessDetail from "@/components/business/BusinessDetail";

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
    // TODO esperar a que estén los métodos para probar esto!!

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

    // Handle errors
    if (!response.ok) {

        console.log(`Failed to fetch business data: ${response.statusText}`);

    }

    const data = await response.json();
    const business: Business = data.data;

    return (
        <div className="container mx-auto px-4 py-6 mt-20">
            <h1 className="text-3xl font-bold mb-8">Business Details</h1>

            {/* Pass business data to client component */}
            <BusinessDetail business={business} />
        </div>
    );
}