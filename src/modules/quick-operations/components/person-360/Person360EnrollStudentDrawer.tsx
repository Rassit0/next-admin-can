"use client";
import { Button, Select, Drawer, ListBox, Label, Spinner } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mortarboard01Icon } from "@hugeicons/core-free-icons";
import { useState, useEffect } from "react";

import { IPersonProfileSummary } from "../../interfaces/secretary-summary.interface";
import { getDisciplinesOptions } from "@/modules/course-seasons/actions/get-disciplines-options";
import { getCourseSeasons } from "@/modules/course-seasons/actions/get";
import { getCourseSeasonById } from "@/modules/course-seasons/actions/get-by-id";
import { getPaymentPlans } from "@/modules/payment-plans/actions/get";
import { revalidatePersonSummaryCache } from "../../actions/revalidate-summary";
import { ICourseSeason } from "@/modules/course-seasons";
import { IPaymentPlan } from "@/modules/payment-plans";
import { EnrollMembershipForm } from "@/modules/student-memberships/components/form/EnrollMembershipForm";

interface Props {
  profile: IPersonProfileSummary;
  trigger?: React.ReactNode | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: "lg" | "md" | "sm";
  onSuccess?: () => void;
}

export const Person360EnrollStudentDrawer = ({
  profile,
  trigger,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
  size = "md",
  onSuccess,
}: Props) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnOpenChange || setInternalIsOpen;

  const [disciplines, setDisciplines] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<
    string | null
  >(null);

  const [courseSeasons, setCourseSeasons] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedCourseSeasonId, setSelectedCourseSeasonId] = useState<
    string | null
  >(null);

  const [loadingContext, setLoadingContext] = useState(false);

  const [courseSeasonData, setCourseSeasonData] =
    useState<ICourseSeason | null>(null);
  const [paymentPlansData, setPaymentPlansData] = useState<
    IPaymentPlan[] | null
  >(null);

  // Load disciplines on open
  useEffect(() => {
    if (isOpen && disciplines.length === 0) {
      getDisciplinesOptions().then((res) => {
        if (!res.error) {
          setDisciplines(
            res.data.data.map((d: any) => ({
              id: d.id.toString(),
              name: d.name,
            })),
          );
        }
      });
    }
  }, [isOpen]);

  // Load course seasons when discipline changes
  useEffect(() => {
    if (selectedDisciplineId) {
      setCourseSeasons([]);
      setSelectedCourseSeasonId(null);
      setCourseSeasonData(null);
      setPaymentPlansData(null);
      getCourseSeasons({ per_page: "100" }).then((csRes) => {
        if (!csRes.error) {
          const filteredCourseSeasons = csRes.data.data.filter(
            (cs) => cs.course.school?.disciplineId === selectedDisciplineId,
          );
          setCourseSeasons(
            filteredCourseSeasons.map((cs) => ({
              id: cs.id,
              name: `${cs.course.name} - ${cs.season.name}`,
            })),
          );
        }
      });
    }
  }, [selectedDisciplineId]);

  // Fetch full context when course season is selected
  useEffect(() => {
    if (selectedCourseSeasonId) {
      setLoadingContext(true);
      Promise.all([
        getCourseSeasonById({ id: selectedCourseSeasonId }),
        getPaymentPlans({
          courseSeasonId: selectedCourseSeasonId,
          per_page: "100",
        }),
      ])
        .then(([seasonRes, plansRes]) => {
          if (!seasonRes.error && !plansRes.error) {
            setCourseSeasonData(seasonRes.data);
            setPaymentPlansData(plansRes.data.data);
          }
        })
        .finally(() => setLoadingContext(false));
    } else {
      setCourseSeasonData(null);
      setPaymentPlansData(null);
    }
  }, [selectedCourseSeasonId]);

  const defaultStudent = {
    id: profile.studentId || "NEW",
    person: {
      id: profile.id,
      fullName:
        `${profile.name} ${profile.lastName} ${profile.secondLastName || ""}`.trim(),
      name: profile.name,
      lastName: profile.lastName,
      secondLastName: profile.secondLastName || null,
      gender: null,
      documentNumber: profile.documentNumber || null,
      birthDate: null,
      imageUrl: profile.imageUrl || null,
    },
  };

  const handleSuccess = () => {
    revalidatePersonSummaryCache(profile.id);
    onSuccess?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedDisciplineId(null);
    setSelectedCourseSeasonId(null);
    setCourseSeasonData(null);
    setPaymentPlansData(null);
  };

  return (
    <>
      {trigger !== undefined ? (
        trigger ? (
          <div onClick={() => setIsOpen(true)}>{trigger}</div>
        ) : null
      ) : (
        <Button
          variant="primary"
          size="sm"
          onPress={() => setIsOpen(true)}
          className="gap-2 bg-accent hover:bg-accent-hover text-accent-foreground"
        >
          <HugeiconsIcon icon={Mortarboard01Icon} size={16} />
          Inscribir en Curso
        </Button>
      )}

      <Drawer.Backdrop
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isDismissable={false}
      >
        <Drawer.Content placement="right">
          <Drawer.Dialog className="w-full sm:max-w-md">
            <Drawer.CloseTrigger />
            <Drawer.Header className="border-b border-border">
              <Drawer.Heading className="text-lg font-bold">
                Inscripción de Estudiante
              </Drawer.Heading>
              <p className="mt-1 text-xs text-muted">
                Selecciona la disciplina y el curso para inscribir a la persona.
              </p>
            </Drawer.Header>

            
            {loadingContext ? (
              <Drawer.Body className="flex items-center justify-center">
                <Spinner />
              </Drawer.Body>
            ) : courseSeasonData && paymentPlansData ? (
              <EnrollMembershipForm
                isFromPerson360
                courseSeason={courseSeasonData}
                paymentPlans={paymentPlansData}
                defaultStudent={defaultStudent}
                headerNode={(<div className="flex flex-col gap-4 mb-4">
                  <Select
                    placeholder="Seleccione..."
                    value={selectedDisciplineId}
                    onChange={(key) =>
                      setSelectedDisciplineId(key?.toString() || null)
                    }
                  >
                    <Label className="text-sm font-semibold">Disciplina</Label>
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {disciplines.map((d) => (
                          <ListBox.Item key={d.id} id={d.id} textValue={d.name}>
                            {d.name}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <Select
                    placeholder="Seleccione..."
                    isDisabled={
                      !selectedDisciplineId || courseSeasons.length === 0
                    }
                    value={selectedCourseSeasonId}
                    onChange={(key) =>
                      setSelectedCourseSeasonId(key?.toString() || null)
                    }
                  >
                    <Label className="text-sm font-semibold">
                      Curso y Temporada
                    </Label>
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {courseSeasons.map((ts) => (
                          <ListBox.Item key={ts.id} id={ts.id} textValue={ts.name}>
                            {ts.name}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>)}
                onSuccess={() => {
                  handleSuccess();
                  setIsOpen(false);
                }}
                onCancel={() => setIsOpen(false)}
              />
            ) : (
              <Drawer.Body>
                <div className="flex flex-col gap-4 mb-4">
                  <Select
                    placeholder="Seleccione..."
                    value={selectedDisciplineId}
                    onChange={(key) =>
                      setSelectedDisciplineId(key?.toString() || null)
                    }
                  >
                    <Label className="text-sm font-semibold">Disciplina</Label>
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {disciplines.map((d) => (
                          <ListBox.Item key={d.id} id={d.id} textValue={d.name}>
                            {d.name}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <Select
                    placeholder="Seleccione..."
                    isDisabled={
                      !selectedDisciplineId || courseSeasons.length === 0
                    }
                    value={selectedCourseSeasonId}
                    onChange={(key) =>
                      setSelectedCourseSeasonId(key?.toString() || null)
                    }
                  >
                    <Label className="text-sm font-semibold">
                      Curso y Temporada
                    </Label>
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {courseSeasons.map((ts) => (
                          <ListBox.Item key={ts.id} id={ts.id} textValue={ts.name}>
                            {ts.name}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-8 text-center">
                  Selecciona una disciplina y curso para continuar con la
                  inscripci�n.
                </div>
              </Drawer.Body>
            )}
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </>
  );
};
