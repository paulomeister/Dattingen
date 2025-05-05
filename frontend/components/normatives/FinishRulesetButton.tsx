"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface FinishRulesetButtonProps {
  rulesetId: string | string[];
  rulesetName?: string;
  onFinish?: () => void;
}

const FinishRulesetButton = ({
  rulesetId,
  rulesetName = "esta normativa",
  onFinish,
}: FinishRulesetButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2"
        >
          <CheckCircle className="h-5 w-5" />
          <span>Finalizar Normativa</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-primary-color">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Finalizar Normativa
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Estás a punto de finalizar la edición de <span className="font-semibold">{rulesetName}</span>. Una vez finalizada, esta normativa será publicada y ya no podrás editarla.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-800">Atención</h4>
              <p className="text-sm text-amber-700 mt-1">
                Esta acción es irreversible. Una vez que finalices la normativa, no podrás volver a editarla y se considerará como una versión publicada oficial.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="flex sm:justify-between gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="flex-1 border-gray-300"
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            onClick={handleFinish}
          >
            Confirmar y Finalizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FinishRulesetButton;