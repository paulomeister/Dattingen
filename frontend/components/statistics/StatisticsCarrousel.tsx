"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import TrendCompliancesChart from "@/components/statistics/TrendCompliancesChart"
import type { TrendCompliances } from "@/types/statistics"

type AuditData = {
  rulesetName: string
  conformityProcess: number
  nonConformityProcess: number
  phvaInformities: {
    plan: number
    doPhase: number
    check: number
    act: number
  }
  conformityTendency: TrendCompliances[]
}

type StatisticsData = {
  totalAudits: number
  totalAuditsActive: number
  auditsWithMostProcesses: any | null
  meanAuditTime: number
  audits: AuditData[]
}

interface StatisticsCarouselProps {
  data: StatisticsData
}

export default function StatisticsCarousel({ data }: StatisticsCarouselProps) {

  const { totalAudits, totalAuditsActive, meanAuditTime, audits } = data
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  const minSwipeDistance = 50

  const nextSlide = () => {
    if (audits?.length) {
      setCurrentIndex((prevIndex) => (prevIndex === audits.length - 1 ? 0 : prevIndex + 1))
    }
  }

  const prevSlide = () => {
    if (audits?.length) {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? audits.length - 1 : prevIndex - 1))
    }
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    }
    if (isRightSwipe) {
      prevSlide()
    }
  }

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  // Si no hay auditorías, mostrar un mensaje
  if (!audits || audits.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-xl shadow text-center">
        <p className="text-gray-500">No hay datos de auditorías disponibles</p>
      </div>
    )
  }

  const audit = audits[currentIndex]

  // Determinar la fase PHVA con más inconformidades
  const phvaTotals = audit.phvaInformities
  const phvaKeyWithMostInconformities = Object.entries(phvaTotals).reduce(
    (max, curr) => (curr[1] > max[1] ? curr : max),
    ["", 0],
  )[0]

  const phvaMapping: Record<string, string> = {
    plan: "Planear (P)",
    doPhase: "Hacer (H)",
    check: "Verificar (V)",
    act: "Actuar (A)",
  }

  const phvaWithMostInconformities =
    phvaKeyWithMostInconformities && phvaMapping[phvaKeyWithMostInconformities]
      ? phvaMapping[phvaKeyWithMostInconformities]
      : "No determinado"

  return (
    <div className="relative w-full overflow-hidden">
      <div
        ref={carouselRef}
        className="w-full"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 rounded-xl shadow">
          <div className="bg-white p-4 rounded-2xl shadow col-span-1">
            <p className="text-gray-500 text-sm">Auditorías Totales</p>
            <h2 className="text-2xl font-bold text-gray-800">{totalAudits}</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow col-span-1">
            <p className="text-gray-500 text-sm">Auditorías Activas</p>
            <h2 className="text-2xl font-bold text-gray-800">{totalAuditsActive}</h2>
          </div>

          {/* <div className="bg-white p-4 rounded-2xl shadow col-span-1">
            <p className="text-gray-500 text-sm">Conjunto de Reglas</p>
            <h2 className="text-xl font-bold text-gray-800 truncate">{audit.rulesetName || "No especificado"}</h2>
          </div> */}

          <div className="bg-white p-4 rounded-2xl shadow col-span-1">
            <p className="text-gray-500 text-sm">Duración Promedio</p>
            <h2 className="text-2xl font-bold text-gray-800">{meanAuditTime} hrs</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow col-span-1">
            <p className="text-gray-500 text-sm">% Conformidades</p>
            <h2 className="text-2xl font-bold text-green-600">{audit.conformityProcess.toFixed(1)}%</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow col-span-1">
            <p className="text-gray-500 text-sm">% No Conformidades</p>
            <h2 className="text-2xl font-bold text-red-600">{audit.nonConformityProcess.toFixed(1)}%</h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Tendencia de Conformidades</h3>
            {audit.conformityTendency && audit.conformityTendency.length > 0 ? (
              <TrendCompliancesChart data={audit.conformityTendency} />
            ) : (
              <p className="text-gray-500 text-center py-10">No hay datos de tendencia disponibles</p>
            )}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow col-span-1">
            <h3 className="text-lg font-semibold mb-2">PHVA con más No Conformidades</h3>
            <p className="text-xl font-bold text-red-500">{phvaWithMostInconformities}</p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons - Solo mostrar si hay más de una auditoría */}
      {audits.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full z-10"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Anterior</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full z-10"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Siguiente</span>
          </Button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {audits.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${currentIndex === index ? "bg-gray-800 w-6" : "bg-gray-400"
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Ir a la diapositiva ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
