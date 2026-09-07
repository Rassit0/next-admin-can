"use client";
import { Button, Select, Drawer, ListBox, Label, Spinner } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserAdd01Icon } from "@hugeicons/core-free-icons";
import { useState, useEffect } from "react";

import { IPersonProfileSummary } from "../../interfaces/secretary-summary.interface";
import { getDisciplinesOptions } from "@/modules/team-seasons/actions/get-disciplines-options";
import { getTeamSeasons } from "@/modules/team-seasons/actions/get";
import { getTeamSeasonById } from "@/modules/team-seasons/actions/get-by-id";
import { getPaymentPlans } from "@/modules/payment-plans/actions/get";
import { revalidatePersonSummaryCache } from "../../actions/revalidate-summary";
import { ITeamSeason } from "@/modules/team-seasons";
import { IPaymentPlan } from "@/modules/payment-plans";
import { EnrollMembershipForm } from "@/modules/player-memberships/components/form/EnrollMembershipForm";

interface Props {
  profile: IPersonProfileSummary;
  trigger?: React.ReactNode | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: "lg" | "md" | "sm";
  onSuccess?: () => void;
}

export const Person360EnrollPlayerDrawer = ({
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

  const [teamSeasons, setTeamSeasons] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedTeamSeasonId, setSelectedTeamSeasonId] = useState<
    string | null
  >(null);

  const [loadingContext, setLoadingContext] = useState(false);

  const [teamSeasonData, setTeamSeasonData] = useState<ITeamSeason | null>(
    null,
  );
  const [paymentPlansData, setPaymentPlansData] = useState<
    IPaymentPlan[] | null
  >(null);

  // Load disciplines on open
  useEffect(() => {
    if (isOpen && disciplines.length === 0) {
      getDisciplinesOptions().then((res) => {
        if (!res.error) setDisciplines(res.data.data);
      });
    }
  }, [isOpen]);

  // Load team seasons when discipline changes
  useEffect(() => {
    if (selectedDisciplineId) {
      setTeamSeasons([]);
      setSelectedTeamSeasonId(null);
      setTeamSeasonData(null);
      setPaymentPlansData(null);
      getTeamSeasons({ per_page: "100" }).then((tsRes) => {
        if (!tsRes.error) {
          const filteredTeamSeasons = tsRes.data.data.filter(
            (ts) => ts.team?.club?.discipline?.id === selectedDisciplineId,
          );
          setTeamSeasons(
            filteredTeamSeasons.map((ts) => ({
              id: ts.id,
              name: `${ts.team.name} - ${ts.season.name}`,
            })),
          );
        }
      });
    }
  }, [selectedDisciplineId]);

  // Fetch full context when team season is selected
  useEffect(() => {
    if (selectedTeamSeasonId) {
      setLoadingContext(true);
      Promise.all([
        getTeamSeasonById({ id: selectedTeamSeasonId }),
        getPaymentPlans({
          teamSeasonId: selectedTeamSeasonId,
          per_page: "100",
        }),
      ])
        .then(([seasonRes, plansRes]) => {
          if (!seasonRes.error && !plansRes.error) {
            setTeamSeasonData(seasonRes.data);
            setPaymentPlansData(plansRes.data.data);
          }
        })
        .finally(() => setLoadingContext(false));
    } else {
      setTeamSeasonData(null);
      setPaymentPlansData(null);
    }
  }, [selectedTeamSeasonId]);

  const defaultPlayer = {
    id: profile.playerId || "NEW",
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
    setSelectedTeamSeasonId(null);
    setTeamSeasonData(null);
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
          <HugeiconsIcon icon={UserAdd01Icon} size={16} />
          Inscribir a Equipo
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
                Inscripci├│n de Jugador
              </Drawer.Heading>
              <p className="mt-1 text-xs text-muted">
                Selecciona la disciplina y el equipo para inscribir a la
                persona.
              </p>
            </Drawer.Header>

            
            {loadingContext ? (
              <Drawer.Body className="flex items-center justify-center">
                <Spinner />
              </Drawer.Body>
            ) : teamSeasonData && paymentPlansData ? (
              <EnrollMembershipForm
                isFromPerson360
                teamSeason={teamSeasonData}
                paymentPlans={paymentPlansData}
                defaultPlayer={defaultPlayer}
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
                      !selectedDisciplineId || teamSeasons.length === 0
                    }
                    value={selectedTeamSeasonId}
                    onChange={(key) =>
                      setSelectedTeamSeasonId(key?.toString() || null)
                    }
                  >
                    <Label className="text-sm font-semibold">
                      Equipo y Temporada
                    </Label>
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {teamSeasons.map((ts) => (
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
                      !selectedDisciplineId || teamSeasons.length === 0
                    }
                    value={selectedTeamSeasonId}
                    onChange={(key) =>
                      setSelectedTeamSeasonId(key?.toString() || null)
                    }
                  >
                    <Label className="text-sm font-semibold">
                      Equipo y Temporada
                    </Label>
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {teamSeasons.map((ts) => (
                          <ListBox.Item key={ts.id} id={ts.id} textValue={ts.name}>
                            {ts.name}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
                <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-8 text-center">
                  Selecciona una disciplina y equipo para continuar con la
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
