import { CardLouncher } from "@/modules/module-louncher";
import { DashboardCircleEditIcon, GlobalIcon } from "@hugeicons/core-free-icons";

export const ModuleGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CardLouncher
        href="/admin/dashboard"
        icon={DashboardCircleEditIcon}
        title="Administración General"
        description="Gestiona la configuración, estructura y operación de la organización deportiva desde un único panel centralizado."
        tagText="Panel Administrativo"
      />
      <CardLouncher
        href="/admin/web"
        icon={GlobalIcon}
        title="Administración Web"
        description="Gestiona las noticias, publicaciones, anuncios, historia e información de 'Nosotros' en el portal web del club."
        tagText="CMS y Portales"
      />
    </div>
  );
};
