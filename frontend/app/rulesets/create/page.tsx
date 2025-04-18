"use client";
import CreateNormativeItem from "@/components/normatives/CreateNormativeItem";
import Viewer from "@/components/normatives/Viewer";
import React, { useEffect, useState } from "react";

const CreateNormativeItemPage = () => {
  const [isCreating, setIsCreating] = React.useState<boolean>(false);
  const [selectedText, setSelectedText] = React.useState<string>("");
  // DIALOG

  function closeDialog(): void {
    setIsCreating(false);
  }

  function openDialog(): void {
    setIsCreating(true);
  }

  function handleTextSelection(): void {
    const selection = window.getSelection();

    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString()); // Estado que se pasa al componente
      openDialog();
    }

    window.getSelection()?.removeAllRanges();
  }

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="">
      <div
        className={`fixed top-1/2 right-1 z-1000 transform -translate-x-1/2 -translate-y-1/2 
        transition-all
        duration-300 ease-in-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        {isCreating && (
          <CreateNormativeItem
            onClose={closeDialog}
            selectedText={selectedText}
          />
        )}
      </div>
      <div></div>
      <div className="flex  flex-col items-center justify-center border-1 border-slate-300 px-5 md:mt-[-30px]">
        <Viewer onTextSelection={handleTextSelection} />
      </div>
    </div>
  );
};

export default CreateNormativeItemPage;
