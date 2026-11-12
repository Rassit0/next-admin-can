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
    <section className="flex flex-col sm:flex-row sm:items-start md:items-center justify-between gap-3 sm:gap-4 mb-2 lg:mb-4 min-w-0 flex-1">
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <div className="flex flex-col min-w-0">
          <BreadcrumbList breadcrumb={breadcrumb} urlBase={urlBase} />

          {typeof title === "string" ? (
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-sky-800 dark:text-sky-300 font-heading tracking-tight break-words leading-tight">
              {title}
            </h2>
          ) : (
            title
          )}
        </div>
        {typeof description === "string" ? (
          <p className="text-muted text-xs sm:text-sm leading-relaxed break-words">
            {description}
          </p>
        ) : (
          description
        )}
        {children && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {children}
          </div>
        )}
      </div>
      {(action || showButtonBack) && (
        <div className="flex flex-row flex-wrap items-center justify-end gap-2 shrink-0 self-end sm:self-center">
          {action}
          {showButtonBack && <ButtonBack />}
        </div>
      )}
    </section>
  );
};
