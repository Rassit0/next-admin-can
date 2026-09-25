import { CardLouncher } from "@/modules/module-louncher";
import { NavigationConfig } from "@/config/navigation";
import {
  NavigationIcon,
  NavigationIconKey,
} from "@/ui/components/navigation/IconRegistry";

export interface ModuleGridProps {
  items?: NavigationConfig[];
}

export const ModuleGrid = ({ items = [] }: ModuleGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <CardLouncher
          key={item.id}
          href={item.href.startsWith("/") ? item.href : `/admin/${item.href}`}
          iconNode={
            <NavigationIcon
              iconKey={item.icon as NavigationIconKey}
              size={40}
            />
          }
          title={item.label}
          description={
            item.description || "Gestione esta seccón de la plataforma."
          }
          tagText={item.tagText || "Módulo"}
        />
      ))}
    </div>
  );
};
