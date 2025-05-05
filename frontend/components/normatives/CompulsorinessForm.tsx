"use client"
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Compulsoriness } from "@/types/Criterion";
import { toast } from "react-hot-toast";

interface CompulsorinessFormProps {
  compulsoriness?: Compulsoriness;
  onSave: (data: Compulsoriness) => void;
  onDelete?: (id: string) => void;
}

const CompulsorinessForm: React.FC<CompulsorinessFormProps> = ({
  compulsoriness,
  onSave,
  onDelete,
}) => {
  const [term, setTerm] = useState(compulsoriness?.term || "");

  const handleSubmit = () => {
    if (!term.trim()) return toast.error("Term cannot be empty");
    onSave({ id: compulsoriness?.id || crypto.randomUUID(), term });
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg shadow-md">
      <Input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Enter term"
      />
      <div className="flex gap-2">
        <Button onClick={handleSubmit} className="bg-blue-500">
          {compulsoriness ? "Save" : "Create"}
        </Button>
        {compulsoriness && onDelete && (
          <Button
            onClick={() => onDelete(compulsoriness.id)}
            className="bg-red-500"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default CompulsorinessForm;
