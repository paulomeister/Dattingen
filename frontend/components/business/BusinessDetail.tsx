"use client";

import { Business } from "@/types/Business";
import { Card } from "@/components/ui/card";
import BusinessAssociates from "./BusinessAssociates";
import BusinessStatistics from "./BusinessStatistics";

interface BusinessDetailProps {
    business: Business;
}

export default function BusinessDetail({ business }: BusinessDetailProps) {
    return (
        <div className="grid grid-cols-2 grid-rows-2 gap-6 h-[calc(100vh-200px)]">
            {/* Top row - Business Info - spans both columns */}
            <Card className="col-span-2 p-6 shadow-lg">
                <div className="flex gap-6">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-4 text-primary-color">{business.name}</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">Activity</h3>
                                <p className="text-gray-700 whitespace-pre-wrap">{business.activity}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">Team Size</h3>
                                <p className="text-gray-700">{business.associates?.length || 0} members</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">Audit Count</h3>
                                <p className="text-gray-700">{business.audits?.length || 0} audits</p>
                            </div>
                        </div>
                    </div>

                    {business.logo && (
                        <div className="w-40 h-40 relative">
                            <img
                                src={business.logo}
                                alt={`${business.name} logo`}
                                className="object-contain w-full h-full"
                            />
                        </div>
                    )}
                </div>
            </Card>

            {/* Bottom left - Users section */}
            <Card className="p-6 shadow-lg overflow-auto">
                <BusinessAssociates associates={business.associates || []} />
            </Card>

            {/* Bottom right - Statistics section */}
            <Card className="p-6 shadow-lg overflow-auto">
                <BusinessStatistics audits={business.audits || []} />
            </Card>
        </div>
    );
}