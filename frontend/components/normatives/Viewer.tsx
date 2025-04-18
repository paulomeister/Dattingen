"use client";
import React, { useState, useRef, SyntheticEvent } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "../ui/button";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Viewer = ({
  file = "/somefile.pdf",
  onTextSelection,
}: {
  file?: string;
  onTextSelection: () => void;
}) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [inputPage, setInputPage] = useState<string>("1");
  const viewerRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setInputPage("1");
  }

  function nextPage() {
    setPageNumber((prev) => (prev < (numPages || 1) ? prev + 1 : prev));
    setInputPage(String(pageNumber + 1));
  }

  function backPage() {
    setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));
    setInputPage(String(pageNumber - 1));
  }

  function zoomIn() {
    setScale(Math.min(scale + 0.25, 2));
  }

  function zoomOut() {
    setScale(Math.max(scale - 0.25, 0.5));
  }

  function handlePageInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputPage(value);

    const pageNum = parseInt(value);
    if (!isNaN(pageNum) && pageNum > 0 && pageNum <= (numPages || 1)) {
      setPageNumber(pageNum);
    }
  }

  return (
    <div className="space-y-4 mt-7">
      <div
        ref={viewerRef}
        onMouseUp={() => onTextSelection()}
        className="relative border rounded-lg overflow-auto"
      >
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>

      <div className="flex items-center justify-between space-x-4 mb-7">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={zoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={zoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <span className="text-sm text-muted-foreground">
            Zoom: {Math.round(scale * 100)}%
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={backPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={inputPage}
              onChange={handlePageInput}
              min={1}
              max={numPages}
              className="w-16 text-center"
            />
            <span className="text-sm text-muted-foreground">of {numPages}</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextPage}
            disabled={pageNumber >= (numPages || 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Viewer;
