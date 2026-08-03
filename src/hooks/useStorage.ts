import { useState, useCallback } from "react";
import { uploadAttachments, deleteAttachment } from "@/modules/storage/actions/upload";

export interface UploadedAttachment {
  id: string;
  originalName: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
}

export function useStorage() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return [];
    
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await uploadAttachments(formData);
      
      if (response.error) {
        throw new Error(response.message || "Error al subir archivos");
      }
      
      return response.data || [];
    } catch (err: any) {
      setError(err.message || "Error al subir los archivos");
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const deleteFile = useCallback(async (id: string) => {
    try {
      await deleteAttachment(id);
    } catch (err: any) {
      console.error("Error deleting file", err);
    }
  }, []);

  return {
    uploadFiles,
    deleteFile,
    isUploading,
    error,
  };
}
