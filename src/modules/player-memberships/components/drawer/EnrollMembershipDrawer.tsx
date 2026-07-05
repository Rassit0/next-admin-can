"use client";
import {
  Button,
  ComboBox,
  Drawer,
  Input,
  Label,
  ListBox,
  Surface,
  Switch,
  TextField,
  toast,
  useOverlayState,
} from "@heroui/react";
import { Add01Icon, UserAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ITeamSeason } from "@/modules/team-seasons";
import { IPaymentPlan } from "@/modules/payment-plans";
import { IPlayer } from "@/modules/players";
import {
  addPlayerMembership,
  getPreviewCharges,
  IPlayerOption,
  IPreviewChargesResponse,
} from "@/modules/player-memberships";
import { calculateInitialCharges } from "@/modules/player-memberships/helpers/initial-charges";
import { InvoicePreview } from "@/modules/player-memberships/components/invoice/InvoicePreview";
import { SelectOrCreatePlayer } from "./SelectOrCreatePlayer";

interface Props {
  teamSeason: ITeamSeason;
  paymentPlans: IPaymentPlan[];
  size?: "lg" | "md" | "sm";
}

const today = () => new Date().toISOString().slice(0, 10);

export const EnrollMembershipDrawer = ({
  teamSeason,
  paymentPlans,
  size = "md",
}: Props) => {
  const state = useOverlayState();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [playerKey, setPlayerKey] = useState<string | null>(null);
  const [planKey, setPlanKey] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<string>(today());
  const [isMigrated, setIsMigrated] = useState(false);

  const [selectedPlayer, setSelectedPlayer] = useState<IPlayerOption | null>(
    null,
  );

  const selectedPlan = paymentPlans.find((p) => p.id === planKey) ?? null;

  const [breakdown, setBreakdown] = useState<IPreviewChargesResponse | null>(
    null,
  );

  const reset = () => {
    setPlayerKey(null);
    setPlanKey(null);
    setStartedAt(today());
    setIsMigrated(false);
    setBreakdown(null);
  };

  useEffect(() => {
    if (!playerKey || !planKey || !startedAt) return;
    handlePreview();
  }, [playerKey, planKey, startedAt, isMigrated]);

  const handlePreview = async () => {
    if (!playerKey || !planKey || !startedAt) {
      return;
    }

    const res = await getPreviewCharges({
      teamSeasonId: teamSeason.id,
      paymentPlanId: planKey,
      startDate: new Date(startedAt).toISOString(),
      isMigrated,
    });
    console.log({ res });

    if (res.error) {
      toast.danger(res.message, {
        description: res.errors
          ? Object.values(res.errors).flat().join(", ")
          : res.message,
      });
      setBreakdown(null);
      return;
    }

    setBreakdown(res.data);
  };

  const handleSubmit = async () => {
    if (!playerKey || !planKey || !startedAt) {
      toast.danger("Datos incompletos", {
        description:
          "Selecciona el atleta, el plan de pago y la fecha de inicio.",
      });
      return;
    }
    setLoading(true);
    const res = await addPlayerMembership({
      playerId: playerKey,
      teamSeasonId: teamSeason.id,
      paymentPlanId: planKey,
      startedAt: new Date(startedAt).toISOString(),
      isMigrated,
    });
    setLoading(false);

    if (res.error) {
      toast.danger(res.message, {
        description: res.errors
          ? Object.values(res.errors).flat().join(", ")
          : res.message,
      });
      return;
    }
    toast.success(res.message, {
      description: selectedPlayer
        ? `${selectedPlayer?.person?.fullName} fue inscrito en la temporada.`
        : undefined,
    });
    reset();
    state.close();
    router.refresh();
  };

  const noPlans = paymentPlans.length === 0;

  return (
    <>
      <Button
        size={size}
        className="w-full bg-accent text-accent-foreground font-semibold text-sm shadow-md shadow-accent-soft-hover hover:shadow-lg hover:scale-[1.01] active:scale-95 transition-all"
        onPress={() => state.open()}
      >
        <HugeiconsIcon icon={UserAdd01Icon} size={18} />
        Inscribir Atleta
      </Button>

      <Drawer.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Drawer.Content placement="right">
          <Drawer.Dialog className="w-full sm:max-w-md">
            <Drawer.CloseTrigger />
            <Drawer.Header className="border-b border-border">
              <div>
                <Drawer.Heading className="text-lg font-bold">
                  Inscribir atleta
                </Drawer.Heading>
                <p className="mt-1 text-xs font-medium text-muted">
                  {teamSeason.team.name} · {teamSeason.season.name}
                </p>
              </div>
            </Drawer.Header>

            <Drawer.Body className="gap-5">
              <Surface variant="transparent" className="flex flex-col gap-5">
                {/* Player picker */}
                <SelectOrCreatePlayer
                  playerId={playerKey}
                  setPlayerId={setPlayerKey}
                  setSelectedPlayer={setSelectedPlayer}
                  // isDisabled={noPlayers}
                  label="Atleta"
                  // errors={errors}
                  // handleRemoveError={handleRemoveError}
                />

                {/* Payment plan picker */}
                <ComboBox
                  className="w-full"
                  variant="secondary"
                  menuTrigger="focus"
                  selectedKey={planKey}
                  onSelectionChange={(key) =>
                    setPlanKey(key ? String(key) : null)
                  }
                  isDisabled={noPlans}
                >
                  <Label className="text-sm font-semibold">Plan de pago</Label>
                  <ComboBox.InputGroup>
                    <Input
                      variant="secondary"
                      placeholder={
                        noPlans
                          ? "Crea un plan de pago primero"
                          : "Selecciona un plan de pago"
                      }
                    />
                    <ComboBox.Trigger />
                  </ComboBox.InputGroup>
                  <ComboBox.Popover>
                    <ListBox>
                      {paymentPlans.map((plan) => (
                        <ListBox.Item
                          key={plan.id}
                          id={plan.id}
                          textValue={plan.name}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{plan.name}</span>
                            <span className="text-[11px] text-muted">
                              Insc. -{plan.registrationDiscountPercent}% · Mens.
                              -{plan.monthlyDiscountPercent}%
                            </span>
                          </div>
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </ComboBox.Popover>
                </ComboBox>

                {/* Start date */}
                <TextField className="w-full" name="startedAt">
                  <Label className="text-sm font-semibold">
                    Fecha de inicio
                  </Label>
                  <Input
                    variant="secondary"
                    type="date"
                    value={startedAt}
                    onChange={(e) => setStartedAt(e.target.value)}
                  />
                </TextField>

                {/* Switch for migration */}
                <div className="flex items-center gap-2 px-1">
                  <Switch isSelected={isMigrated} onChange={setIsMigrated}>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                    <Switch.Content>
                      <Label className="text-sm">
                        Es Migración (omitir cargos iniciales)
                      </Label>
                    </Switch.Content>
                  </Switch>
                </div>

                {/* {JSON.stringify({
                  teamSeasonId: teamSeason.id,
                  playerKey,
                  planKey,
                  startedAt,
                  // breakdown,
                })} */}

                {/* {JSON.stringify({ breakdown })} */}
                {/* Live invoice preview */}
                {breakdown?.data && (
                  <InvoicePreview
                    breakdown={breakdown}
                    planName={selectedPlan?.name}
                    playerName={
                      selectedPlayer ? selectedPlayer.person.fullName : null
                    }
                  />
                )}
              </Surface>
            </Drawer.Body>

            <Drawer.Footer className="border-t border-border">
              <Button
                slot="close"
                variant="secondary"
                isDisabled={loading}
                onPress={() => reset()}
                className="font-medium"
              >
                Cancelar
              </Button>
              <Button
                onPress={handleSubmit}
                isPending={loading}
                isDisabled={loading || noPlans}
                className="font-semibold"
              >
                <HugeiconsIcon icon={Add01Icon} size={18} />
                Confirmar
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </>
  );
};
