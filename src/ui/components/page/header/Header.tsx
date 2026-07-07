import { ChevronRight } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Breadcrumb } from "./Breadcrumb";

interface BreadcrumbItem {
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
}
export const HeaderPage = ({
  title,
  description,
  action,
  children,
  urlBase,
  breadcrumb,
}: Props) => {
  return (
    <section className="flex flex-wrap flex-row justify-between items-center gap-4 mb-0 lg:mb-4">
      <div className="flex justify-between flex-wrap">
        <div>
          <div className="flex flex-col">
            <div className="hidden lg:flex items-center md:gap-2 text-outline text-[10px] md:mb-2 font-semibold tracking-wide uppercase">
              {breadcrumb?.map((item, index) => (
                <div key={index} className="flex items-center md:gap-2">
                  <Breadcrumb
                    key={index}
                    breadcrumb={item}
                    urlBase={urlBase}
                    isLast={index === breadcrumb.length - 1}
                  />

                  {index < breadcrumb.length - 1 && (
                    <HugeiconsIcon icon={ChevronRight} size={16} />
                  )}
                </div>
              ))}
            </div>
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
      {action && (
        <div className="flex flex-wrap w-full md:w-auto justify-end gap-2">
          {action}
        </div>
      )}
    </section>
  );
};
