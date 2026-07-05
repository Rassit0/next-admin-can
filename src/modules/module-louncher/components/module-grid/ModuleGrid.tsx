import {
  AdminWebCard,
  CardAdmin,
  ClubsCard,
  FinanceCard,
  SchoolsCard,
  SettingsCard,
} from "@/modules/module-louncher";
import { SupportContactCard } from "./SupportContactCard";

export const ModuleGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* <!-- Administración --> */}
      <CardAdmin />
      {/* <!-- Escuelas --> */}
      {/* <SchoolsCard /> */}
      {/* <!-- Clubes --> */}
      {/* <ClubsCard /> */}
      {/* <!-- Finanzas --> */}
      {/* <FinanceCard /> */}
      {/* <!-- Administración Web --> */}
      {/* <AdminWebCard /> */}
      {/* <!-- Configuraciones --> */}
      {/* <SettingsCard /> */}
      {/* <!-- Support Integration --> */}
      {/* <SupportContactCard /> */}
    </div>
  );
};
