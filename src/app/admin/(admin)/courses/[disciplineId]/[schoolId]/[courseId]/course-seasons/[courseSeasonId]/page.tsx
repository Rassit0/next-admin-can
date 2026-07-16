import { ErrorPage } from "@/ui";
import { getCourseSeasonById, getCourseSeasonSummary } from "@/modules/course-seasons";
import { MetricsCards } from "@/modules/student-memberships";
import { Button, Card, Alert, Chip, Popover } from "@heroui/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-border flex flex-col gap-5 bg-surface-container-lowest">
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-lg">
            Resumen Financiero y Reglas
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
            <Chip
              color="accent"
              variant="soft"
              size="sm"
              className="font-semibold tracking-wide uppercase"
            >
              Género: {GENDER_MAP[courseSeason.gender] || courseSeason.gender}
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

        <Alert status="accent">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Edades Permitidas</Alert.Title>
            <Alert.Description>
              {courseSeason.minBirthYear || courseSeason.maxBirthYear
                ? `Se han restringido los años de nacimiento permitidos desde ${courseSeason.minBirthYear || "Cualquiera"} hasta ${courseSeason.maxBirthYear || "Cualquiera"}.`
                : `Los atletas deben tener una edad deportiva entre ${courseSeason.category.minAge} y ${courseSeason.category.maxAge} años.`}
            </Alert.Description>
          </Alert.Content>
        </Alert>
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
