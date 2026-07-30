"use client";
import React from "react";
import { Popover, Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";

interface Props {
  text: string;
}

export const InfoTooltip = ({ text }: Props) => {
  return (
    <Popover>
      <Button
        isIconOnly
        variant="ghost"
        size="sm"
        className="h-5 w-5 min-w-5 text-muted-foreground ml-2"
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
};
