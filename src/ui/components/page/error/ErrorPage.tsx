"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

interface Props {
  message: string;
  path?: {
    href: string;
    label: string;
  };
}
export const ErrorPage = ({ message, path }: Props) => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold">Error</h1>
        <p className="text-lg">{message}</p>
        {path && (
          <Button variant="primary" onPress={() => router.push(path.href)}>
            {path.label}
          </Button>
        )}
      </div>
    </div>
  );
};
