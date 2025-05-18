import StatisticsCarousel from "@/components/statistics/StatisticsCarrousel"
import type { StatisticsData } from "@/types/statistics"

interface StatisticsPageProps {
  data: StatisticsData
}

export default function StatisticsPage({ data }: StatisticsPageProps) {
  return (
    <div className="max-w-7xl mx-auto p-2">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
        Estadísticas de la Organización
      </h1>

      <div className="mb-12">
        <StatisticsCarousel data={data} />
      </div>
    </div>
  )
}