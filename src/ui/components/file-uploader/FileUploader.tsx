import React, { useCallback, useRef } from "react";
import { Button } from "@heroui/react";
import {
  CloudUploadIcon,
  Cancel01Icon,
  DocumentAttachmentIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import clsx from "clsx";

export interface FileUploaderProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export function FileUploader({
  files,
  onFilesChange,
  maxFiles = 5,
  accept = "image/jpeg, image/png, image/webp, application/pdf",
  maxSizeMB = 5,
  className,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(Array.from(e.dataTransfer.files));
        e.dataTransfer.clearData();
      }
    },
    [files, maxFiles, maxSizeMB]
  );

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        return false;
      }
      return true;
    });

    onFilesChange([...files, ...validFiles].slice(0, maxFiles));
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeFile = (indexToRemove: number) => {
    onFilesChange(files.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className={clsx("w-full flex flex-col gap-4", className)}>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={clsx(
          "w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
          "border-default-300 hover:border-primary hover:bg-primary/5",
          "bg-default-50 text-default-500"
        )}
      >
        <HugeiconsIcon icon={CloudUploadIcon} size={32} className="mb-2" />
        <p className="text-sm font-medium">
          Haz clic o arrastra archivos aquí
        </p>
        <p className="text-xs mt-1 text-default-400">
          Max {maxFiles} archivos. Hasta {maxSizeMB}MB c/u.
        </p>
      </div>

      <input
        type="file"
        ref={inputRef}
        onChange={handleFileSelect}
        accept={accept}
        multiple={maxFiles > 1}
        className="hidden"
      />

      {files.length > 0 && (
        <ul className="flex flex-col gap-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 rounded-lg border border-default-200 bg-background shadow-sm"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <HugeiconsIcon icon={DocumentAttachmentIcon} size={20} />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-default-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
              <Button
                isIconOnly
                variant="ghost"
                className="text-danger hover:bg-danger/10"
                size="sm"
                onPress={() => removeFile(index)}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
