"use client";

import { Control, PHVAPhase, Ruleset } from "@/types/Ruleset";
import { format } from "date-fns";
import {
  ClipboardCheck,
  ClipboardEdit,
  Beaker,
  ClipboardList,
  Building2,
  Calendar,
  FileText,
  Tag,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLanguage } from "@/lib/LanguageContext";
import { useRouter } from "next/navigation";

// Component for the header section showing ruleset information
export function RulesetHeader({ ruleset }: { ruleset: Ruleset }) {
  const { t } = useLanguage();
  const router = useRouter()

  // Format date for display
  const formattedDate = ruleset.publishingDate ?
    format(new Date(ruleset.publishingDate), 'MMMM dd, yyyy') :
    'Not specified';


  const handleSubmit = (ruleset: Ruleset) => {
    router.push(`/audits/create/${ruleset._id}`)
  }


  return (
    <div className="bg-gradient-to-r from-primary-color to-secondary-color rounded-xl shadow-xl overflow-hidden mb-8">
      <div className="p-8 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl md:text-4xl font-bold">{ruleset.name}</h1>
          <Button
            onClick={() => handleSubmit(ruleset)}
            className="bg-white text-primary-color hover:bg-white/90 font-bold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition duration-200 transform hover:-translate-y-1"
            size="lg"
          >
            {t("rulesets.details.join")}
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 opacity-80" />
            <span className="opacity-90">{t("rulesets.details.organization")}</span>
            <span className="font-semibold">{ruleset.organization}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 opacity-80" />
            <span className="opacity-90">{t("rulesets.details.published")}</span>
            <span className="font-semibold">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 opacity-80" />
            <span className="opacity-90">{t("rulesets.details.version")}</span>
            <span className="font-semibold">{ruleset.version}</span>
          </div>

          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 opacity-80" />
            <span className="opacity-90">{t("rulesets.details.status")}</span>
            <span className="font-semibold capitalize">{ruleset.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for the controls grid
export function ControlsGrid({ controls }: { controls: Control[] }) {
  const { t } = useLanguage();

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {t("rulesets.details.controls")} ({controls.length})
      </h2>

      {controls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {controls.map((control) => (
            <ControlCard key={control.controlId} control={control} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-xl font-medium text-gray-500">{t("rulesets.details.noControls")}</h3>
          <p className="text-gray-400 mt-2">{t("rulesets.details.noControlsDesc")}</p>
        </div>
      )}
    </div>
  );
}

// Component for the about section
export function AboutRuleset({ controlCount }: { controlCount: number }) {
  const { t } = useLanguage();

  // Replace {count} placeholder with the actual count
  const aboutDesc = t("rulesets.details.aboutDesc").replace("{count}", controlCount.toString());

  return (
    <div className="bg-gray-50 rounded-lg p-6 mt-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("rulesets.details.aboutTitle")}</h3>
      <p className="text-gray-600">
        {aboutDesc}
      </p>
      <div className="flex justify-center mt-6">
        <Button
          className="bg-primary-color hover:bg-primary-color/90 text-white font-medium"
          size="lg"
        >
          {t("rulesets.details.joinButton")}
        </Button>
      </div>
    </div>
  );
}

// Helper function to get appropriate icon for cycle stage
function getCycleStageIcon(stage: PHVAPhase) {
  switch (stage) {
    case PHVAPhase.PLAN:
      return <ClipboardEdit className="h-5 w-5 text-blue-500" />;
    case PHVAPhase.DO:
      return <ClipboardList className="h-5 w-5 text-green-500" />;
    case PHVAPhase.CHECK:
      return <Beaker className="h-5 w-5 text-yellow-500" />;
    case PHVAPhase.ACT:
      return <ClipboardCheck className="h-5 w-5 text-red-500" />;
    default:
      return <ClipboardEdit className="h-5 w-5 text-primary-color" />;
  }
}

// Component for individual control cards
export function ControlCard({ control }: { control: Control }) {
  return (
    <Card className="overflow-hidden border border-gray-200 transition-all hover:shadow-md">
      <CardHeader className={`
        p-4 flex flex-row items-center gap-3 border-b
        ${control.cycleStage === PHVAPhase.PLAN ? 'bg-blue-50' : ''}
        ${control.cycleStage === PHVAPhase.DO ? 'bg-green-50' : ''}
        ${control.cycleStage === PHVAPhase.CHECK ? 'bg-yellow-50' : ''}
        ${control.cycleStage === PHVAPhase.ACT ? 'bg-red-50' : ''}
      `}>
        {getCycleStageIcon(control.cycleStage)}
        <div>
          <p className="text-xs font-medium text-gray-500">Control {control.controlId}</p>
          <h3 className="font-semibold text-gray-800 line-clamp-1">{control.title}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-color/10 text-primary-color">
            {control.cycleStage}
          </span>
          {control.compulsoriness && (
            <span className="inline-flex items-center ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-color/10 text-secondary-color">
              {control.compulsoriness}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-3">{control.description}</p>
      </CardContent>
    </Card>
  );
}

// Error component for displaying error messages
export function ErrorMessage({ message }: { message: string }) {
  const { t } = useLanguage();

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-8">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-red-800">{t("rulesets.details.error.title")}</h3>
          <p className="text-red-600 mt-1">{message}</p>
          <p className="mt-4 text-sm text-red-700">
            {t("rulesets.details.error.retry")}
          </p>
        </div>
      </div>
    </div>
  );
}

// Main details component
export function RulesetDetails({ ruleset }: { ruleset: Ruleset }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <RulesetHeader ruleset={ruleset} />
      <ControlsGrid controls={ruleset.controls} />
      <AboutRuleset controlCount={ruleset.controls.length} />
    </div>
  );
}