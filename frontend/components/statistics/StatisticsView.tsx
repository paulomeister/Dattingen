import StatisticsCarousel from "@/components/statistics/StatisticsCarrousel"
import type { StatisticsData } from "@/types/statistics"
import { ChartColumn } from "lucide-react"

interface StatisticsPageProps {
  data: StatisticsData
}

export default function StatisticsPage({ data }: StatisticsPageProps) {
  return (
    <div className="max-w-7xl mx-auto p-2">
      <h1 className="flex items-center justify-center gap-4 scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl mb-8">
        <ChartColumn size={32 } />
        Estadísticas de la Organización
      </h1>

      <div className="mb-12">
        <StatisticsCarousel data={data} />
      </div>
    </div>
  )
}