"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { SearchFilter } from "@/components/normatives/SearchFilter"
import { NormativeCard } from "@/components/normatives/NormativeCard"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { Ruleset } from "@/types/Ruleset"
import { useLanguage } from "@/lib/LanguageContext"
import { useApiClient } from "@/hooks/useApiClient"

export default function ListNormatives() {
  const api = useApiClient()
  const { t } = useLanguage()
  const [normatives, setNormatives] = useState<Ruleset[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchField, setSearchField] = useState("name")
  const [filteredNormatives, setFilteredNormatives] = useState<Ruleset[]>([])


  useEffect(() => {
    const getNormatives = async () => {
      try {
        const response = await api.get<Ruleset[]>("/rulesets/api/ListAll");

        const data: Ruleset[] = response || []

        setNormatives(data.filter((normative) => normative?.status?.toLowerCase() === "published"))
        setFilteredNormatives(data.filter((normative) => normative?.status?.toLowerCase() === "published"))

      } catch (error) {
        console.error("Error fetching normatives:", error)
      }
    }
    getNormatives()
  }, [])

  // Filtrar normativas basado en búsqueda y campo
  useEffect(() => {
    let filtered = [...normatives]

    if (searchQuery.trim() !== "") {
      const query = searchQuery?.toLowerCase()

      filtered = normatives.filter((normative) => {
        switch (searchField) {
          case "name":
            return normative?.name?.toLowerCase().includes(query)
          case "organization":
            return normative?.organization?.toLowerCase().includes(query)
          case "publishingDate":
            // Simple date search - checks if the formatted date includes the query
            return format(normative.publishingDate, "yyyy-MM-dd").includes(query)
          default:
            return (
              normative?.name?.toLowerCase().includes(query) ||
              normative?.organization?.toLowerCase().includes(query) ||
              format(normative.publishingDate, "yyyy-MM-dd").includes(query)
            )
        }
      })
    }

    setFilteredNormatives(filtered)
  }, [searchQuery, searchField])



  return (
    <div className="flex flex-col bg-background">
      <section className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="title-effect mb-8 text-center">
            <span className="title-company">{t("rulesets.list.title")}</span>
          </div>

          <SearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchField={searchField}
            setSearchField={setSearchField}
          />

          {filteredNormatives.length > 0 ? (
            <div className="mx-auto max-w-5xl">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="py-4">
                  {filteredNormatives.map((normative) => (
                    <CarouselItem key={normative._id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 pl-4">
                      <div className="p-1">
                        <NormativeCard normative={normative} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <CarouselPrevious
                    className="relative  transform-none border-primary border-opacity-20 text-primary"
                  />
                  <CarouselNext
                    className="relative  transform-none border-primary border-opacity-20 text-primary"
                  />
                </div>
              </Carousel>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("rulesets.list.noRulesets")}</p>
            </div>
          )}


          <div className="mt-8 flex justify-center">
            <Link href="/">
              <Button
                variant="outline"
                className="text-sm border-primary border-opacity-20 text-primary hover:bg-primary hover:bg-opacity-5"
              >
                {t("rulesets.list.backHome")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
