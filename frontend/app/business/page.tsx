import { Metadata } from "next";
import BusinessList from "@/components/business/BusinessList";
import BusinessSearch from "@/components/business/BusinessSearch";
import { Building2 } from "lucide-react";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Businesses - ACME Audits",
    description: "Browse and find businesses in the ACME Audit system",
};

export default function BusinessPage() {
    return (
        <div className="container max-w-5xl mx-auto px-4 py-8 mt-20">
            <div className="flex flex-col items-center mb-8">
                <Building2 className="w-16 h-16 text-primary-color mb-4" />
                <h1 className="text-3xl font-bold text-center">
                    Enterprises Directory
                </h1>
                <p className="text-muted-foreground text-center mt-2">
                    Search and browse all available enterprises
                </p>
            </div>

            <Suspense>
                <BusinessSearch />
                <BusinessList />
            </Suspense>
        </div>
    );
}