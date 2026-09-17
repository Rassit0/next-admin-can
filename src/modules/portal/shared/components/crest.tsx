import Image from "next/image";

interface CrestProps {
  className?: string;
  strokeWidth?: number;
}

/** Minimalist club crest outline — a shield with a rising "V" (Nacional) and a star. */
export function Crest({ className, strokeWidth = 4 }: CrestProps) {
  return <Image src="/logo.png" alt="Logo" width={50} height={50} />;
}
