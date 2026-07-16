import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Tabs } from "@heroui/react";
import {
  AddModal,
  getPaymentPlans,
  TablePaymentPlans,
} from "@/modules/payment-plans";
import { getCourseSeasonById } from "@/modules/course-seasons";
import { parseDate } from "@internationalized/date";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
  }>;
  params: Promise<{
    disciplineId: string;
    schoolId: string;
    courseId: string;
    courseSeasonId: string;
  }>;
}
export default async function PaymentPlansPage({
  searchParams,
  params,
}: Props) {
  const { search, page, per_page } = await searchParams;
  const { disciplineId, schoolId, courseId, courseSeasonId } = await params;
  const [paymentPlansResponse, courseSeasonResponse] = await Promise.all([
    getPaymentPlans({
      search,
      page,
      per_page,
      courseSeasonId: courseSeasonId,
    }),
    getCourseSeasonById({ id: courseSeasonId }),
  ]);

  // 1. Manejo de error específico (Ej: 401 no autorizado)
  if (paymentPlansResponse.error && paymentPlansResponse.statusCode === 401) {
    redirect("/login");
  }

  // 2. Manejo de errores generales (400, 500, etc.)
  if (paymentPlansResponse.error) {
    return <ErrorPage message={paymentPlansResponse.message} />;
  }

  if (courseSeasonResponse.error) {
    return <ErrorPage message={courseSeasonResponse.message} />;
  }

  const basePath = `/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons/${courseSeasonId}`;

  return (
    <>
      {/* <!-- Header --> */}
      <HeaderPage
        title={`Planes de Pago - ${courseSeasonResponse.data.course.name} - ${courseSeasonResponse.data.season.name}`}
        description="Administra los planes de pago de la temporada"
        action={
          <AddModal
            courseSeasonId={courseSeasonId}
            courseSeasonBillingType={
              courseSeasonResponse.data.billingConfig?.billingType!
            }
          />
        }
        breadcrumb={[
          { label: "Gestión Cursos", href: `/` },
          {
            label: `Gestión de Temporadas - ${courseSeasonResponse.data.course.name}`,
            href: `/admin/courses/${disciplineId}/${schoolId}/${courseId}/course-seasons`,
          },
          {
            label: `Gestión de Planes de Pago - ${courseSeasonResponse.data.course.name} - ${courseSeasonResponse.data.season.name}`,
          },
        ]}
      />

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border pb-4">
        <Link href={`${basePath}/payment-plans`}>
          <div className="px-4 py-2 rounded-t-lg font-medium text-foreground border-b-2 border-accent bg-accent-soft">
            Planes de Pago
          </div>
        </Link>
        <Link href={`${basePath}/membresias`}>
          <div className="px-4 py-2 rounded-t-lg font-medium text-muted hover:text-foreground hover:bg-surface transition">
            Membresías
          </div>
        </Link>
        <Link href={`${basePath}/pagos`}>
          <div className="px-4 py-2 rounded-t-lg font-medium text-muted hover:text-foreground hover:bg-surface transition">
            Pagos
          </div>
        </Link>
      </div>

      {/* <!-- Search and Filter Bar (Tonal Architecture) --> */}
      <SectionFilters />
      {/* <!-- Main Member Table --> */}
      <TablePaymentPlans
        paymentPlans={paymentPlansResponse.data.data}
        courseSeasonId={courseSeasonId}
        courseSeasonBillingType={
          courseSeasonResponse.data.billingConfig?.billingType!
        }
      />
      <PaginationSection
        totalPages={paymentPlansResponse.data.meta.totalPages}
        itemsPerPage={paymentPlansResponse.data.meta.itemsPerPage}
        totalItems={paymentPlansResponse.data.meta.totalItems}
      />
    </>
  );
}
