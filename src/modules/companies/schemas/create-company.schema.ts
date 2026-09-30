import { z } from "zod";

export const CreateCompanySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  legalName: z.string().optional(),
  taxId: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Debe ser un email válido").optional().or(z.literal("")),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export type ICreateCompanyForm = z.infer<typeof CreateCompanySchema>;
