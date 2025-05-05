import { format } from "date-fns"
import { Calendar } from "lucide-react"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Ruleset } from "@/types/Ruleset"
import { useLanguage } from "@/lib/LanguageContext"
import { useRouter } from "next/navigation"

interface NormativeCardProps {
  normative: Ruleset
}

export function NormativeCard({ normative }: NormativeCardProps) {
  const router = useRouter()
  //TODO Mandar a preguntar al servicio si el coordinador tiene a su empresa metida en cualquiera de estas normativas
  const { t } = useLanguage()

  return (
    <Card className="overflow-y-scroll md:overflow-hidden border border-primary-color/20 shadow-[0_4px_12px_var(--tw-shadow-color)]
     shadow-primary-color/20 transition-all duration-300 hover:-translate-y-1 h-64 md:h-96 rounded-lg
     ">
      <CardHeader className="p-4 m-0 pb-2 bg-primary-color/5">
        <h3 className="text-2xl font-bold text-primary-color">{normative.name}</h3>
        <div className="flex flex-col text-sm text-muted-foreground">
          <span>{normative.version}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3">
        <div className="mb-2 flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          {format(normative.publishingDate, "MMM dd, yyyy")}
        </div>
        <p className="mb-2 text-xs">
          <span className="font-semibold">Org:</span> {normative.organization}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-3">{normative.publishingDate.toString()}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => {
            router.push(`/rulesets/get/${normative._id}`)
          }}
          className="w-full bg-primary-color text-white text-sm font-medium transition-transform hover:scale-105 rounded-md hover:text-secondary-color">
          {t("rulesets.list.itemList.rollIn")}
        </Button>
      </CardFooter>
    </Card>
  )
}
