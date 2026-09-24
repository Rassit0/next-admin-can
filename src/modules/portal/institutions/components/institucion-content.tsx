"use client";

import { Institucion } from "@/modules/portal/institutions/components/institucion-screen";
import { PublicInstitutionHistoryResponse } from "../interfaces/history.interface";

export default function InstitucionContent({ data }: { data: PublicInstitutionHistoryResponse }) {
  return <Institucion data={data} />;
}
