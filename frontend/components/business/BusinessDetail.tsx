"use client";

import { Business } from "@/types/Business";
import { Card } from "@/components/ui/card";
import BusinessAssociates from "./BusinessAssociates";
import StatisticsView from "@/components/statistics/StatisticsView";

import { useLanguage } from "@/lib/LanguageContext";

interface BusinessDetailProps {
    business: Business;
}

export default function BusinessDetail({ business }: BusinessDetailProps) {
    const { t } = useLanguage()

    return (<>
        <h1 className="text-3xl font-bold mb-8">
            {t("business.page.title")}
        </h1>
        <div className="grid grid-cols-1 grid-rows-[minmax(auto, 0.5fr)_minmax(auto,0.5fr)_minmax(auto, 1fr)] gap-6 md:grid-cols-2 sm:grid-rows-[minmax(auto,0.2fr)_minmax(auto,1fr)]">
            {/* Top row - Business Info - spans both columns */}
            <Card className="p-6 shadow-lg">
                <div className="flex gap-6">
                    <div className="flex-col">
                        <h2 className=" text-2xl font-bold mb-4 text-primary-color">{business.name}</h2>
                        <div className="flex-col items-center justify-center gap-48">
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
                <StatisticsView data={business.stats}/>
            </Card>
        </div></>
    );
}