"use client";
import {
  Button,
  Modal,
  useOverlayState,
  Drawer,
  TextField,
  Label,
  Input,
} from "@heroui/react";
import { Add01Icon, Layers01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { FormPaymentPlan } from "@/modules/payment-plans";

interface Props {
  teamSeasonId: string;
  size?: "lg" | "md" | "sm";
}

export const AddMembershipDrawer = ({ teamSeasonId, size = "lg" }: Props) => {
  const state = useOverlayState();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button
        size={size}
        isDisabled
        className="w-full bg-pink-500 text-white font-extrabold text-md pulse-pink shadow-lg shadow-pink-500/20 hover:scale-[1.02] hover:cursor-pointer active:scale-95 transition-all"
        onPress={() => state.open()}
      >
        Inscribir Atleta
      </Button>
      <Drawer.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Drawer.Content placement="right">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>Edit Profile</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <form className="flex flex-col gap-4">
                <TextField className="w-full" name="name" type="text">
                  <Label>Name</Label>
                  <Input placeholder="Enter your name" variant="secondary" />
                </TextField>
                <TextField className="w-full" name="email" type="email">
                  <Label>Email</Label>
                  <Input placeholder="Enter your email" variant="secondary" />
                </TextField>
                <TextField className="w-full" name="bio">
                  <Label>Bio</Label>
                  <Input
                    placeholder="Tell us about yourself"
                    variant="secondary"
                  />
                </TextField>
              </form>
            </Drawer.Body>
            <Drawer.Footer>
              <Button slot="close" variant="secondary">
                Cancel
              </Button>
              <Button slot="close">Save Changes</Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </>
  );
};
