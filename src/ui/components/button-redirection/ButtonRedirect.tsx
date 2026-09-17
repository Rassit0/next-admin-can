"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "danger"
  | "danger-soft"
  | "ghost"
  | "outline"
  | undefined;

interface Props {
  href: string;
  label?: string;
  icon?: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  children?: ReactNode;
}

export const ButtonRedirect = ({
  href,
  label,
  icon,
  variant = "primary",
  className,
  children,
}: Props) => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(href, { scroll: false });
  };

  return (
    <Button className={className} variant={variant} onClick={handleRedirect}>
      {icon && icon}
      {label && <span>{label}</span>}
      {children}
    </Button>
  );
};
