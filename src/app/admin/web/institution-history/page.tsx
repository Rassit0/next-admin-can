import {
  getInstitutionHistorySettings,
  getInstitutionHistoryItems,
  InstitutionHistorySettingsForm,
  TableInstitutionHistory,
  AddInstitutionHistoryItemModal,
} from "@/modules/cms/institution-history";
import { HeaderPage } from "@/ui";
import { resolvePageData } from "@/utils/resolvePageData";

export default async function InstitutionHistoryPage() {
  const [settingsResponse, itemsResponse] = await resolvePageData([
    getInstitutionHistorySettings(),
    getInstitutionHistoryItems(),
  ]);

  const settingsData = settingsResponse.data;
  const itemsData = itemsResponse.data;

  return (
    <>
      <div className="space-y-8">
        <HeaderPage
          title="Historia Institucional"
          description="Administra la sección introductoria y los hitos históricos (timeline) del portal público."
          action={<AddInstitutionHistoryItemModal />}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 border border-default-200 rounded-xl p-6 bg-default-50">
            <h2 className="text-xl font-bold mb-4">Configuración de Intro</h2>
            <InstitutionHistorySettingsForm defaultValues={settingsData} />
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Línea de Tiempo (Timeline)</h2>
            <TableInstitutionHistory items={itemsData} />
          </div>
        </div>
      </div>
    </>
  );
}
