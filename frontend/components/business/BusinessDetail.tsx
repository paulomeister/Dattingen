"use client";

import { Business } from "@/types/Business";
import { Card } from "@/components/ui/card";
import BusinessAssociates from "./BusinessAssociates";
import StatisticsView from "@/components/statistics/StatisticsView";

import { useLanguage } from "@/lib/LanguageContext";
import { Building2, Info } from "lucide-react";

interface BusinessDetailProps {
    business: Business;
}

export default function BusinessDetail({ business }: BusinessDetailProps) {
    const { t } = useLanguage()

    return (<>
        <h1 className="text-5xl flex items-center justify-center gap-4 font-bold mb-8 text-primary-color">
            <Building2 size={48} />
            {business.name}</h1>
        <div className="grid grid-cols-1 grid-rows-[minmax(auto, 0.5fr)_minmax(auto,0.5fr)_minmax(auto, 1fr)] gap-6 md:grid-cols-2 sm:grid-rows-[minmax(auto,0.2fr)_minmax(auto,1fr)]">
            {/* Top row - Business Info - spans both columns */}
            <Card className="p-6 shadow-lg">
                <div className="flex gap-6">
                    <div className="flex-col">
                        <div className="flex-col items-center justify-center gap-48">
                            
                            <h2 className="flex items-center justify-center gap-4 text-2xl font-semibold mb-4"> 
                                <Info size={24} />
                                {t("business.page.info")}</h2>
                            <div>
                                <h3 className="text-lg font-semibold">{t("business.page.activity")}</h3>
                                <p className="text-gray-700 whitespace-pre-wrap">{business.activity}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">{t("business.page.teamSize")}</h3>
                                <p className="text-gray-700">{business.associates?.length || 0} members</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">{t("business.page.auditsCount")}</h3>
                                <p className="text-gray-700">{business.audits?.length || 0} audits</p>
                            </div>
                        </div>
                    </div>


                </div>
            </Card>            {/* Bottom left - Users section */}
            <Card className="p-6 shadow-lg overflow-auto">
                <BusinessAssociates
                    associates={business.associates || []}
                    businessId={business._id || ''}
                />
            </Card>

            {/* Bottom right - Statistics section */}
            <Card className="md:col-span-2 p-6 shadow-lg">
                {/* <BusinessStatistics audits={business.audits || []} /> */}
                <StatisticsView data={business.stats} />
            </Card>
        </div></>
    );
}