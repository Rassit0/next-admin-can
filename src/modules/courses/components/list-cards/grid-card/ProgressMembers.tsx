"use client";
import { Label, ProgressBar } from "@heroui/react";

interface Props {
  maxMembers: number;
  minMembers: number;
  value: number;
}

export const ProgressMembers = ({ maxMembers, minMembers, value }: Props) => {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold text-on-surface-variant mb-2">
        <span>Capacidad de Miembros</span>
        <span>
          {value} / {maxMembers}
        </span>
      </div>
      <ProgressBar
        aria-label="Revenue"
        className="w-full"
        maxValue={maxMembers}
        //   formatOptions={{
        //     style: "unit",
        //     unit: "mile",
        //     // unitDisplay: "short",
        //   }}
        minValue={minMembers}
        value={value}
      >
        {/* <Label>Capacidad de miembros</Label>
      <ProgressBar.Output /> */}
        <ProgressBar.Track>
          <ProgressBar.Fill />
        </ProgressBar.Track>
      </ProgressBar>
    </div>
  );
};
