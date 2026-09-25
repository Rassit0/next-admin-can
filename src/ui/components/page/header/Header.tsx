import { ChevronRight } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Breadcrumb } from "./Breadcrumb";
import { ButtonBack } from "../../button-back/ButtonBack";
import { BreadcrumbList } from "./BreadcrumbList";

export interface BreadcrumbItem {
  label: string;
  href?: string; // opcional si quieres navegación
}

interface Props {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  urlBase?: string;
  breadcrumb?: BreadcrumbItem[];
  showButtonBack?: boolean;
}
export const HeaderPage = ({
  title,
  description,
  action,
  children,
  urlBase,
  breadcrumb,
  showButtonBack = true,
}: Props) => {
  return (
    <section className="flex flex-row justify-between items-center gap-4 mb-0 lg:mb-4">
      <div className="flex justify-between flex-wrap">
        <div>
          <div className="flex flex-col">
            <BreadcrumbList breadcrumb={breadcrumb} urlBase={urlBase} />

            {typeof title === "string" ? (
              <h2 className="text-2xl md:text-4xl font-extrabold text-sky-800 dark:text-sky-300 font-headline tracking-tight">
                {title}
              </h2>
            ) : (
              title
            )}
          </div>
          {typeof description === "string" ? (
            <p className="text-slate-500 text-sm mt-1">{description}</p>
          ) : (
            description
          )}
        </div>
        <div className="flex gap-2">{children}</div>
      </div>
      {(action || showButtonBack) && (
        <div className="flex flex-row flex-wrap w-full md:w-auto justify-end gap-2">
          {action}
          {showButtonBack && <ButtonBack />}
        </div>
      )}
    </section>
  );
};
