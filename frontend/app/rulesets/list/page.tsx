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

// Define the Ruleset interface if not already imported from types
import { Ruleset } from "@/types/Ruleset"
import { useLanguage } from "@/lib/LanguageContext"

//! Esto se quita
// Muestra los datos de normativas
const normatives: Ruleset[] = [
  {
    id: 1,
    name: "ISO 27001",
    organization: "ISO",
    publishingDate: new Date("2022-10-15"),
    version: "version 1.0",
    criteria: "60 Criterios",
    description:
      "Information security management system standard that helps organizations keep information assets secure.",
    color: "purple",
  },
  {
    id: 2,
    name: "ISO 27001",
    organization: "ISO",
    publishingDate: new Date("2023-05-20"),
    version: "version 2.0",
    criteria: "85 Criterios",
    description: "Updated version of the information security management system standard with additional controls.",
    color: "purple",
  },
  {
    id: 3,
    name: "CIS",
    organization: "Center for Internet Security",
    publishingDate: new Date("2023-01-10"),
    version: "version AG1",
    criteria: "10 Criterios",
    description:
      "Security configuration benchmark for various systems and applications to reduce vulnerability surface area.",
    color: "purple",
  },
  {
    id: 4,
    name: "ISO 9001",
    organization: "ISO",
    publishingDate: new Date("2022-08-05"),
    version: "version 2015",
    criteria: "45 Criterios",
    description: "Quality management system standard to help organizations ensure they meet customer requirements.",
    color: "purple",
  },
  {
    id: 5,
    name: "NIST 800-53",
    organization: "NIST",
    publishingDate: new Date("2023-03-15"),
    version: "version 5",
    criteria: "120 Criterios",
    description: "Security and privacy controls for federal information systems and organizations.",
    color: "purple",
  },
  {
    id: 6,
    name: "ISO 14001",
    organization: "ISO",
    publishingDate: new Date("2022-11-30"),
    version: "version 2015",
    criteria: "30 Criterios",
    description:
      "Environmental management system standard to help organizations minimize their environmental impact.",
    color: "purple",
  }
]

export default function ListNormatives() {

  const { t } = useLanguage()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchField, setSearchField] = useState("name")
  const [filteredNormatives, setFilteredNormatives] = useState<Ruleset[]>([])

  // Filtrar normativas basado en búsqueda y campo
  useEffect(() => {
    let filtered = [...normatives]

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()

      filtered = normatives.filter((normative) => {
        switch (searchField) {
          case "name":
            return normative.name.toLowerCase().includes(query)
          case "organization":
            return normative.organization.toLowerCase().includes(query)
          case "publishingDate":
            // Simple date search - checks if the formatted date includes the query
            return format(normative.publishingDate, "yyyy-MM-dd").includes(query)
          default:
            return (
              normative.name.toLowerCase().includes(query) ||
              normative.organization.toLowerCase().includes(query) ||
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
                    <CarouselItem key={normative.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 pl-4">
                      <div className="p-1">
                        <NormativeCard normative={normative} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <CarouselPrevious
                    className="relative static transform-none border-primary border-opacity-20 text-primary"
                  />
                  <CarouselNext
                    className="relative static transform-none border-primary border-opacity-20 text-primary"
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
