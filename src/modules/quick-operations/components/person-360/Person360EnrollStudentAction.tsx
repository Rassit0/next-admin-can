"use client";
import { useState, useEffect } from "react";
import { 
  Button, 
  Modal, 
  Select, 
  ListBox, 
  Label,
  Spinner
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mortarboard01Icon } from "@hugeicons/core-free-icons";

import { IPersonProfileSummary } from "../../interfaces/secretary-summary.interface";
import { getDisciplinesOptions } from "@/modules/course-seasons/actions/get-disciplines-options";
import { getCourseSeasons } from "@/modules/course-seasons/actions/get";
import { getCourseSeasonById } from "@/modules/course-seasons/actions/get-by-id";
import { getPaymentPlans } from "@/modules/payment-plans/actions/get";
import { revalidatePersonSummaryCache } from "../../actions/revalidate-summary";
import { ICourseSeason } from "@/modules/course-seasons";
import { IPaymentPlan } from "@/modules/payment-plans";
import { EnrollMembershipDrawer } from "@/modules/student-memberships/components/drawer/EnrollMembershipDrawer";

interface Props {
  profile: IPersonProfileSummary;
}

export const Person360EnrollStudentAction = ({ profile }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [disciplines, setDisciplines] = useState<{ id: string; name: string }[]>([]);
  const [selectedDisciplineId, setSelectedDisciplineId] = useState<string | null>(null);
  
  const [courseSeasons, setCourseSeasons] = useState<{ id: string; name: string }[]>([]);
  const [selectedCourseSeasonId, setSelectedCourseSeasonId] = useState<string | null>(null);

  const [loadingContext, setLoadingContext] = useState(false);
  
  const [courseSeasonData, setCourseSeasonData] = useState<ICourseSeason | null>(null);
  const [paymentPlansData, setPaymentPlansData] = useState<IPaymentPlan[] | null>(null);

  // Load disciplines on open
  useEffect(() => {
    if (isModalOpen && disciplines.length === 0) {
      getDisciplinesOptions().then(res => {
        if (!res.error) {
          setDisciplines(res.data.data.map(d => ({ id: d.id.toString(), name: d.name })));
        }
      });
    }
  }, [isModalOpen]);

  // Load course seasons when discipline changes
  useEffect(() => {
    if (selectedDisciplineId) {
      setCourseSeasons([]);
      setSelectedCourseSeasonId(null);
      getCourseSeasons({ per_page: "100" }).then((csRes) => {
        if (!csRes.error) {
          const filteredCourseSeasons = csRes.data.data.filter(
            (cs) => cs.course.school?.disciplineId === selectedDisciplineId
          );
          setCourseSeasons(
            filteredCourseSeasons.map((cs) => ({
              id: cs.id,
              name: `${cs.course.name} - ${cs.season.name}`,
            }))
          );
        }
      });
    }
  }, [selectedDisciplineId]);

  const handleContinue = async () => {
    if (!selectedCourseSeasonId) return;
    
    setLoadingContext(true);
    try {
      const [seasonRes, plansRes] = await Promise.all([
        getCourseSeasonById({ id: selectedCourseSeasonId }),
        getPaymentPlans({ courseSeasonId: selectedCourseSeasonId, per_page: "100" })
      ]);

      if (!seasonRes.error && !plansRes.error) {
        setCourseSeasonData(seasonRes.data);
        setPaymentPlansData(plansRes.data.data);
        setIsModalOpen(false); // Close selector
        setIsDrawerOpen(true); // Open drawer
      }
    } finally {
      setLoadingContext(false);
    }
  };

  const defaultPerson = {
    id: profile.id,
    fullName: `${profile.name} ${profile.lastName} ${profile.secondLastName || ''}`.trim(),
    name: profile.name,
    lastName: profile.lastName,
    secondLastName: profile.secondLastName || null,
    gender: null,
    documentType: null,
    documentNumber: profile.documentNumber || null,
    birthDate: null,
    imageUrl: profile.imageUrl || null,
  };

  return (
    <>
      <Button 
        variant="primary" 
        size="sm" 
        onPress={() => setIsModalOpen(true)}
        className="gap-2 bg-primary hover:bg-primary-hover"
      >
        <HugeiconsIcon icon={Mortarboard01Icon} size={16} />
        Inscribir a Curso
      </Button>

      <Modal>
        <Modal.Backdrop isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
          <Modal.Container placement="center">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading slot="title">Seleccionar Curso</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-4">
                <Select
                  placeholder="Seleccione..."
                  selectedKey={selectedDisciplineId}
                  onSelectionChange={(key) => setSelectedDisciplineId(key?.toString() || null)}
                >
                  <Label>Disciplina</Label>
                  <Select.Trigger />
                  <Select.Popover>
                  <ListBox>
                    {disciplines.map(d => (
                      <ListBox.Item key={d.id} id={d.id}>{d.name}</ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
                </Select>

                <Select
                  placeholder="Seleccione..."
                  isDisabled={!selectedDisciplineId || courseSeasons.length === 0}
                  selectedKey={selectedCourseSeasonId}
                  onSelectionChange={(key) => setSelectedCourseSeasonId(key?.toString() || null)}
                >
                  <Label>Curso y Temporada</Label>
                  <Select.Trigger />
                  <Select.Popover>
                  <ListBox>
                    {courseSeasons.map(cs => (
                      <ListBox.Item key={cs.id} id={cs.id}>{cs.name}</ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button 
                variant="primary" 
                isDisabled={!selectedCourseSeasonId || loadingContext} 
                onPress={handleContinue}
              >
                {loadingContext && <Spinner size="sm" color="current" />}
                Continuar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>

      {courseSeasonData && paymentPlansData && (
        <EnrollMembershipDrawer
          courseSeason={courseSeasonData}
          paymentPlans={paymentPlansData}
          trigger={null}
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          defaultPerson={defaultPerson}
          onSuccess={async () => {
            await revalidatePersonSummaryCache(profile.id);
          }}
        />
      )}
    </>
  );
};
