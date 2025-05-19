"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Define the Control type based on your data structure
interface Control {
    controlId: string
    title: string
    description: string
    suitability: string | null
    cycleStage: "PLAN" | "DO" | "CHECK" | "ACT"
    compulsoriness: string
}

// Props for the component
interface ISOControlsAccordionProps {
    controls: Control[]
    onControlClick: (control: Control) => void
}

export default function ControlsAccordion({ controls, onControlClick }: ISOControlsAccordionProps) {
    // Group controls by cycle stage
    const groupedControls = controls.reduce(
        (acc, control) => {
            if (!acc[control.cycleStage]) {
                acc[control.cycleStage] = []
            }
            acc[control.cycleStage].push(control)
            return acc
        },
        {} as Record<string, Control[]>,
    )


    // TODO Multilingual!!!
    // Order of cycle stages
    const cycleStages = ["PLAN", "DO", "CHECK", "ACT"]

    return (
        <div className="w-full">
            <Accordion type="single" collapsible className="w-full">
                {cycleStages.map((stage) => {
                    if (!groupedControls[stage] || groupedControls[stage].length === 0) return null

                    return (
                        <AccordionItem key={stage} value={stage}>
                            <AccordionTrigger className="text-primary-color font-bold text-xl px-4">{stage}</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 p-2">
                                    {groupedControls[stage].map((control) => (
                                        <div
                                            key={control.controlId}
                                            className="p-3 border border-secondary-color rounded-md hover:bg-tertiary-color/10 cursor-pointer transition-colors"
                                            onClick={() => onControlClick(control)}
                                        >
                                            <h3 className="font-medium text-primary-color">{control.title}</h3>
                                            <p className="text-sm text-secondary-color mt-1 line-clamp-2">{control.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    )
}
