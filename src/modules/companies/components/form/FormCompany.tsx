"use client";
import { ICreateCompanyForm } from "@/modules/companies/schemas/create-company.schema";
import { createCompanyAction } from "@/modules/companies/actions/create-company.action";
import { ICompanyOption } from "@/modules/companies/interfaces/company.interface";
import { Button, Form, Input, Label, TextField, TextArea, toast, Toast } from "@heroui/react";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  formId: string;
  onSubmited?: (company: ICompanyOption) => void;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export const FormCompany = ({ formId, onSubmited, isLoading, setIsLoading }: Props) => {
  const [formData, setFormData] = useState<ICreateCompanyForm>({
    name: "",
    taxId: "",
    legalName: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await createCompanyAction(formData);
    setIsLoading(false);

    if (!res.error && res.data) {
      toast.success("Empresa/Entidad creada correctamente");
      onSubmited?.(res.data);
    } else {
      toast.danger(res.message || "Error al crear la empresa");
    }
  };

  return (
    <Form id={formId} onSubmit={onSubmit} className="gap-4 md:gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
        <TextField isRequired>
          <Label>Nombre comercial</Label>
          <Input 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          />
        </TextField>
        <TextField>
          <Label>Razón Social (Opcional)</Label>
          <Input 
            value={formData.legalName || ""} 
            onChange={(e) => setFormData({ ...formData, legalName: e.target.value })} 
          />
        </TextField>
        <TextField>
          <Label>NIT / Tax ID (Opcional)</Label>
          <Input 
            value={formData.taxId || ""} 
            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} 
          />
        </TextField>
        <TextField>
          <Label>Teléfono (Opcional)</Label>
          <Input 
            value={formData.phone || ""} 
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
          />
        </TextField>
        <TextField>
          <Label>Email (Opcional)</Label>
          <Input 
            type="email" 
            value={formData.email || ""} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          />
        </TextField>
        <TextField>
          <Label>Dirección (Opcional)</Label>
          <Input 
            value={formData.address || ""} 
            onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
          />
        </TextField>
        <TextField className="md:col-span-2">
          <Label>Notas</Label>
          <TextArea 
            value={formData.notes || ""} 
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })} 
          />
        </TextField>
      </div>
    </Form>
  );
};
