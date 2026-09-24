"use client";
import React, { useRef, useState } from "react";
import { Avatar, Button, Spinner } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Camera01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { ServiceResponse } from "@/types/api";
import { toast } from "@heroui/react";

interface Props {
  initialImageUrl?: string | null;
  initials: string;
  altText: string;
  updateAction: (formData: FormData) => Promise<ServiceResponse<any>>;
}

export const AvatarEditor = ({ initialImageUrl, initials, altText, updateAction }: Props) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.danger("El tamaño máximo permitido es 5MB");
      return;
    }

    // Validate MIME
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.danger("Solo se permiten imágenes JPEG, PNG o WEBP");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await updateAction(formData);

    setIsUploading(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (res.error) {
      toast.danger(res.message || "No se pudo actualizar el avatar");
      return;
    }

    toast.success("Tu foto de perfil ha sido actualizada exitosamente");

    // Refresh client-side state to re-fetch Server Components and Context
    router.refresh();
  };

  return (
    <div className="relative group">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />
      
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary-container/20 group-hover:border-primary transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
        <Avatar size="lg" className="w-full h-full text-4xl">
          {initialImageUrl && (
            <Avatar.Image src={initialImageUrl} alt={altText} />
          )}
          <Avatar.Fallback delayMs={600} className="font-bold text-primary bg-secondary-container">
            {initials}
          </Avatar.Fallback>
        </Avatar>
        
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          {isUploading ? (
            <Spinner color="current" className="text-white" />
          ) : (
            <HugeiconsIcon icon={Camera01Icon} className="w-8 h-8 text-white" />
          )}
        </div>
      </div>
      
      <div className="mt-3 flex justify-center">
        <Button 
          size="sm" 
          variant="secondary"
          isPending={isUploading}
          onPress={() => fileInputRef.current?.click()}
        >
          {!isUploading && <HugeiconsIcon icon={Camera01Icon} className="w-4 h-4 mr-2" />}
          {isUploading ? "Subiendo..." : "Cambiar foto"}
        </Button>
      </div>
    </div>
  );
};
