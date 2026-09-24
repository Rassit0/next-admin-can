import { InstitutionPrinciplesClient } from "@/modules/portal/institutions/components/institution-principles-client";

export const metadata = {
  title: "Nuestros Principios | Club Atli©tico Nacional",
  description: "Misión, visión y valores del Club Atli©tico Nacional.",
};

export default function BeginningPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pt-36">
      <InstitutionPrinciplesClient />
    </div>
  );
}
