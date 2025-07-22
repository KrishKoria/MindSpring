"use client";
import { useCallback } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { EmptyState, ErrorState } from "./render-state";
import { toast } from "sonner";

export default function FileUploader() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Files dropped:", acceptedFiles);
  }, []);
  const rejectedFiles = useCallback((fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      const tooManyFiles = fileRejections.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );
      if (tooManyFiles) {
        toast.error("Too many files Selected. Please select only one file.");
      }
      const filetooLarge = fileRejections.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );
      if (filetooLarge) {
        toast.error(
          "File is too large. Please select a file smaller than 5MB."
        );
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: rejectedFiles,
  });
  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 w-full h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        <EmptyState isDragActive={isDragActive} />
        {/* <ErrorState /> */}
      </CardContent>
    </Card>
  );
}
