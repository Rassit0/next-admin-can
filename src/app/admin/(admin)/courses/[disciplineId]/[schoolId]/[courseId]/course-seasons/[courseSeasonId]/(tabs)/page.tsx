import { ErrorPage } from "@/ui";
import { getCourseSeasonById, getCourseSeasonSummary } from "@/modules/course-seasons";
import { MetricsCards } from "@/modules/student-memberships";
import { Avatar, Button, Card, Alert, Chip, Popover } from "@heroui/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { STAFF_ROLES_TRANSLATOR } from "@/utils/constants";

const InfoTooltip = ({ text }: { text: string }) => (
  <Popover>
    <Button
      isIconOnly
      variant="ghost"
      size="sm"
      className="h-4 w-4 min-w-4 text-muted-foreground ml-1 p-0"
    >
      <HugeiconsIcon icon={InformationCircleIcon} size={14} />
    </Button>
    <Popover.Content placement="top">
      <Popover.Dialog className="max-w-50 px-3 py-2">
        <Popover.Arrow />
        <p className="text-xs font-normal normal-case tracking-normal text-foreground">
          {text}
        </p>
      </Popover.Dialog>
    </Popover.Content>
  </Popover>
);

interface Props {
  params: Promise<{
    disciplineId: string;
    schoolId: string;
    courseId: string;
    courseSeasonId: string;
  }>;
}

export default async function CourseSeasonDashboardPage({ params }: Props) {
  const { courseSeasonId } = await params;

  const [courseSeasonResponse, summaryResponse] = await Promise.all([
    getCourseSeasonById({ id: courseSeasonId }),
    getCourseSeasonSummary({ id: courseSeasonId }),
  ]);

  if (courseSeasonResponse.error || !courseSeasonResponse.data) {
    return <ErrorPage message={courseSeasonResponse.message} />;
  }

  const courseSeason = courseSeasonResponse.data;
  const summary = summaryResponse.data?.data;

  const GENDER_MAP: Record<string, string> = {
    MALE: "Masculino",
    FEMALE: "Femenino",
    MIXED: "Mixto",
  };

  const allStaffs = courseSeason.shifts?.flatMap((shift) =>
    (shift.courseSeasonStaffs || []).map((staffAssignment) => ({
      ...staffAssignment,
      shiftName: shift.shift?.name,
    }))
  ) || [];

  return (
    <div className="flex flex-col gap-6">
      {allStaffs.length > 0 && (
        <Card className="p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-border flex flex-col gap-5 bg-surface-container-lowest">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-lg">
              Personal Asignado
            </h3>
          </div>
          <hr className="border-border" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allStaffs.map((staffAssignment) => (
              <div key={staffAssignment.id} className="flex items-center gap-3 bg-surface-container-low p-3 rounded-xl border border-border/50">
                <Avatar size="md">
                  {staffAssignment.staff.person.imageUrl && (
                    <Avatar.Image src={staffAssignment.staff.person.imageUrl} alt={`${staffAssignment.staff.person.name} ${staffAssignment.staff.person.lastName}`} />
                  )}
                  <Avatar.Fallback>{`${staffAssignment.staff.person.name.charAt(0)}${staffAssignment.staff.person.lastName.charAt(0)}`}</Avatar.Fallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {staffAssignment.isPrimary ? "Profesor Principal" : "Staff"} • {STAFF_ROLES_TRANSLATOR[staffAssignment.role] || staffAssignment.role} • {staffAssignment.shiftName}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {staffAssignment.staff.person.name} {staffAssignment.staff.person.lastName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-border flex flex-col gap-5 bg-surface-container-lowest">
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-lg">
            Resumen Financiero
          </h3>
          <div className="flex items-center gap-2">
            <Chip
              color={courseSeason.isRegistrationOpen ? "success" : "danger"}
              variant="soft"
              size="sm"
              className="font-semibold tracking-wide uppercase"
            >
              {courseSeason.isRegistrationOpen ? "Inscripciones Abiertas" : "Inscripciones Cerradas"}
            </Chip>
          </div>
        </div>
        <hr className="border-border" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold flex items-center">
              Modelo de Cobro
              <InfoTooltip text="Define si la temporada permite pagos fragmentados mes a mes, o si es un pago cerrado." />
            </p>
            <p className="font-bold text-sm">
              {courseSeason.billingConfig?.billingType === "MONTHLY_ONLY" && "Sólo Recurrente"}
              {courseSeason.billingConfig?.billingType === "SINGLE_ONLY" && "Sólo Pago Único"}
              {courseSeason.billingConfig?.billingType === "BOTH" && "Pago Único o Recurrente"}
            </p>
          </div>
          {courseSeason.billingConfig?.billingType !== "SINGLE_ONLY" && (
            <>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold flex items-center">
                  Matrícula
                  <InfoTooltip text="Costo único que se cobra al inicio (o prorrateado) por ingresar al equipo en esta temporada." />
                </p>
                <p className="font-bold text-sm">
                  {courseSeason.billingConfig?.registrationFee
                    ? `${courseSeason.billingConfig?.registrationFee} Bs.`
                    : "Gratis"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold flex items-center">
                  Cuota Base (
                  {courseSeason.billingConfig?.billingFrequency === "WEEKLY"
                    ? "Semanal"
                    : courseSeason.billingConfig?.billingFrequency === "BIWEEKLY"
                      ? "Quincenal"
                      : "Mensual"}
                  )
                  <InfoTooltip text="Monto recurrente base que se cobrará periódicamente (antes de aplicar planes o descuentos)." />
                </p>
                <p className="font-bold text-sm">
                  {courseSeason.billingConfig?.recurringFee
                    ? `${courseSeason.billingConfig?.recurringFee} Bs.`
                    : "Gratis"}
                </p>
              </div>
            </>
          )}
          {(courseSeason.billingConfig?.billingType === "SINGLE_ONLY" ||
            courseSeason.billingConfig?.billingType === "BOTH") && (
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold flex items-center">
                Tarifa Temporada Completa
                <InfoTooltip text="Costo de la temporada completa si el modelo permite o requiere Pago Único (esquema cerrado)." />
              </p>
              <p className="font-bold text-sm">
                {courseSeason.billingConfig?.seasonFee
                  ? `${courseSeason.billingConfig?.seasonFee} Bs.`
                  : "Gratis"}
              </p>
            </div>
          )}
          <div className="col-span-full">
            <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold flex items-center">
              Opciones de Prorrateo Activas
              <InfoTooltip text="Si el jugador ingresa tarde (después de la fecha de inicio del ciclo), el sistema cobrará la fracción correspondiente matemáticamente a los días activos de las opciones que veas aquí marcadas." />
            </p>
            <div className="flex flex-wrap gap-2">
              {courseSeason.billingConfig?.prorateRegistrationFee && (
                <Chip size="sm" variant="soft" color="default">
                  Matrícula
                </Chip>
              )}
              {courseSeason.billingConfig?.prorateFirstRecurringFee && (
                <Chip size="sm" variant="soft" color="default">
                  Primer Cargo Recurrente
                </Chip>
              )}
              {courseSeason.billingConfig?.prorateLastRecurringFee && (
                <Chip size="sm" variant="soft" color="default">
                  Último Cargo Recurrente
                </Chip>
              )}
              {courseSeason.billingConfig?.prorateSeasonFee && (
                <Chip size="sm" variant="soft" color="default">
                  Tarifa Temporada (Pago Único)
                </Chip>
              )}
              {!courseSeason.billingConfig?.prorateRegistrationFee &&
                !courseSeason.billingConfig?.prorateFirstRecurringFee &&
                !courseSeason.billingConfig?.prorateLastRecurringFee &&
                !courseSeason.billingConfig?.prorateSeasonFee && (
                  <span className="text-xs italic text-muted-foreground">
                    Ninguna (Se cobran los montos completos siempre)
                  </span>
                )}
            </div>
          </div>
        </div>

      </Card>

      <Card className="p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-border flex flex-col gap-5 bg-surface-container-lowest">
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-lg">
            Turnos y Reglas de Participación
          </h3>
        </div>
        <hr className="border-border" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courseSeason.shifts?.map((shiftItem) => (
            <div key={shiftItem.id} className="flex flex-col gap-2 p-4 rounded-xl border border-border/50 bg-surface-container-low">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base">{shiftItem.shift?.name || "Turno"}</span>
                <Chip size="sm" color="accent" variant="soft" className="font-semibold tracking-wide uppercase">{GENDER_MAP[shiftItem.gender] || shiftItem.gender}</Chip>
              </div>
              <div className="flex flex-col text-sm text-muted-foreground mt-2 space-y-1">
                <span><strong className="text-foreground">Categoría:</strong> {shiftItem.category?.name}</span>
                <span>
                  <strong className="text-foreground">Edades:</strong>{" "}
                  {shiftItem.minBirthYear || shiftItem.maxBirthYear
                    ? `${shiftItem.minBirthYear || "Cualquiera"} al ${shiftItem.maxBirthYear || "Cualquiera"}`
                    : `${shiftItem.category?.minAge} a ${shiftItem.category?.maxAge || "Sin límite"} años`}
                </span>
                <span><strong className="text-foreground">Capacidad:</strong> {shiftItem.minMembers} min - {shiftItem.maxMembers} max</span>
              </div>
            </div>
          ))}
          {(!courseSeason.shifts || courseSeason.shifts.length === 0) && (
            <p className="text-sm text-muted-foreground italic col-span-full">No hay turnos configurados para esta temporada.</p>
          )}
        </div>
      </Card>

      <MetricsCards
        courseSeason={courseSeason}
        totalItems={summary?.occupiedSlotsCount || 0}
        globalTotalPending={summary?.totalPending}
        globalTotalPaid={summary?.totalPaid}
        activeMembers={summary?.activeMembers}
        suspendedMembers={summary?.suspendedMembers}
        pendingMembers={summary?.pendingMembers}
        totalBilled={summary?.totalBilled}
      />
    </div>
  );
}
