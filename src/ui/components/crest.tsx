import Image from "next/image";

interface CrestProps {
  className?: string;
}

/** Minimalist club crest outline — a shield with a rising "V" (Nacional) and a star. */
export function Crest({ className }: CrestProps) {
  return (
    <Image
      src="/logo.png"
      alt="Logo"
      width={50}
      height={50}
      className={className}
    />
  );
}
