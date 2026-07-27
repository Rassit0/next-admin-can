'use client';

import { Alert } from '@heroui/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert01Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';

interface MembershipsAlertsProps {
  alerts: {
    id: string;
    title: string;
    description: string;
    type: 'warning' | 'info' | 'error' | 'success';
  }[];
}

export const MembershipsAlerts = ({ alerts }: MembershipsAlertsProps) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {alerts.map((alert) => {
        const colorMap: Record<string, "default" | "warning" | "danger" | "success" | "accent"> = {
          warning: "warning",
          error: "danger",
          success: "success",
          info: "accent",
        };
        const color = colorMap[alert.type] || "default";

        return (
          <Alert
            key={alert.id}
            color={color}
          >
          <Alert.Indicator>
            {alert.type === 'warning' ? <HugeiconsIcon icon={Alert01Icon} /> : <HugeiconsIcon icon={InformationCircleIcon} />}
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Title>{alert.title}</Alert.Title>
            <Alert.Description>{alert.description}</Alert.Description>
          </Alert.Content>
        </Alert>
        );
      })}
    </div>
  );
};
