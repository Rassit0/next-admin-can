"use client";
import React, { useCallback, useState } from "react";
import { useStorage } from "@/hooks/useStorage";
import { Spinner, cn } from "@heroui/react";
import { Camera01Icon, Delete01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface Props {
  onUploadComplete?: (url: string) => void;
  onDelete?: () => void;
  defaultImage?: string | null;
  className?: string;
}

export const ImageUploaderDropzone: React.FC<Props> = ({
  onUploadComplete,
  onDelete,
  defaultImage,
  className,
}) => {
  const { uploadFiles, isUploading, error } = useStorage();
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      return; // Could show toast error here
    }

    // Local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const uploaded = await uploadFiles([file]);
      if (uploaded.length > 0 && onUploadComplete) {
        onUploadComplete(uploaded[0].url);
      }
    } catch (e) {
      console.error(e);
      // Revert if error?
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPreview(null);
    if (onDelete) onDelete();
  };

  return (
    <div className={cn("relative group w-32 h-32 rounded-full overflow-hidden border-2 flex items-center justify-center bg-content2 cursor-pointer transition-colors", 
      isDragOver ? "border-primary" : "border-dashed border-default-300",
      className
    )}
    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
    onDragLeave={() => setIsDragOver(false)}
    onDrop={handleDrop}
    >
      <input 
        type="file" 
        accept="image/*"
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
        title="Arrastra o haz click para subir imagen"
      />
      
      {preview ? (
        <>
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 pointer-events-none">
            <button 
              type="button"
              className="p-2 bg-danger rounded-full text-white hover:bg-danger-600 pointer-events-auto"
              onClick={handleDelete}
              disabled={isUploading}
            >
              <HugeiconsIcon icon={Delete01Icon} size={18} />
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-default-500 p-2 text-center pointer-events-none">
          <HugeiconsIcon icon={Camera01Icon} size={24} className="mb-1" />
          <span className="text-xs">Subir foto</span>
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-30">
          <Spinner size="sm" />
        </div>
      )}
    </div>
  );
};
