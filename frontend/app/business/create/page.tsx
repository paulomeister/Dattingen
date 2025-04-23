import { Metadata } from "next";
import BusinessCreationForm from "@/components/business/BusinessCreationForm";
import { Factory } from "lucide-react";
import BusinessCreationHeader from "@/components/business/BusinessCreationHeader";
export const metadata: Metadata = {
    title: "Create Business - ACME Audits",
    description: "Create your business in the ACME Audit system",
};

export default function CreateBusinessPage() {


    return (
        <div className="container max-w-3xl mx-auto px-4">
            <Factory className="w-16 h-16 mx-auto mb-4 text-gray-700" />

            <BusinessCreationHeader />
            <BusinessCreationForm />
        </div>
    );
}