"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import CriterionForm from "./CriterionForm";
import CompulsorinessForm from "./CompulsorinessForm";

// TODO Make the item draggable around the screen
const CreateNormativeItem = ({
  onClose,
  selectedText,
}: {
  onClose: () => void;
  selectedText: string;
}) => {
  const [selectedForm, setSelectedForm] = useState<
    "Criterion" | "Compulsoriness" | null
  >(null);

  return (
    // <Draggable nodeRef={dragRef}>
    <Card
      className="shadow-lg bg-white rounded-xl overflow-auto max-h-[500px]
    transition-all duration-300 ease-in-out"
    >
      <CardHeader className="flex justify-between items-center ">
        <CardTitle className="text-2xl">What do you want to do?</CardTitle>
        <X
          size={24}
          className="hover:text-gray-400 cursor-pointer"
          onClick={onClose}
        />
      </CardHeader>
      <CardContent>
        {!selectedForm ? (
          <div className="grid grid-cols-1 gap-5">
            <Button
              className="bg-sky-500"
              onClick={() => setSelectedForm("Criterion")}
            >
              Criterion
            </Button>
            <Button
              className="bg-sky-500"
              onClick={() => setSelectedForm("Compulsoriness")}
            >
              Compulsoriness
            </Button>
          </div>
        ) : selectedForm === "Criterion" ? (
          <CriterionForm
            onSave={() => setSelectedForm(null)}
            selectedText={selectedText}
          />
        ) : (
          <CompulsorinessForm onSave={() => setSelectedForm(null)} />
        )}
      </CardContent>
    </Card>
    // </Draggable>
  );
};

export default CreateNormativeItem;
