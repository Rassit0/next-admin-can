import Link from "next/link";
import Image from "next/image";
import { Crest } from "./crest";

import { navLinks } from "@/modules/portal/core/constants/navigation";
import { Institution } from "@/modules/portal/institutions/interfaces/institution.interface";

export const SiteFooter = ({ institution }: { institution: Institution }) => {
  const defaultContact =
    institution.contacts?.find((c) => c.isDefault) || institution.contacts?.[0];

  return (
    <footer className="relative z-10 border-t border-border bg-primary text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-neon drop-shadow-[0_0_12px_var(--neon)]">
              <Crest className="h-10 w-9" strokeWidth={5} />
            </span>
            <div className="flex flex-col leading-none">
              <span className="font-heading text-xl font-700 uppercase tracking-wide">
                CAN
              </span>
              <span className="text-[10px] font-500 uppercase tracking-[0.25em] text-white/60">
                {institution.name} ÃÂ·{" "}
                {new Date(institution.createdAt).getFullYear()}
              </span>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white">
            InstituciiÂ³n polideportiva. Formando deportistas y comunidad desde
            hace casi nueve diÂ©cadas.
          </p>
        </div>

        <div>
          <h4 className="font-heading text-sm font-700 uppercase tracking-[0.2em] text-neon">
            NavegaciiÂ³n
          </h4>
          <ul className="mt-4 space-y-2">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white transition-colors hover:text-neon"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-700 uppercase tracking-[0.2em] text-neon">
            Contacto
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-white/90">
            <li>
              <strong className="text-neon">DirecciiÂ³n:</strong>{" "}
              {institution.address}
            </li>
            {defaultContact?.email && (
              <li>
                <strong className="text-neon">Email:</strong>{" "}
                {defaultContact.email}
              </li>
            )}
            <li>
              <strong className="text-neon">Celular:</strong>{" "}
              {defaultContact?.phone || "+591 73841415"}
            </li>
            <li>
              <strong className="text-neon">TeliÂ©fono Fijo:</strong> 25233388
            </li>
          </ul>

          {/* Redes Sociales */}
          <div className="mt-6">
            <h4 className="mb-4 font-heading text-sm font-700 uppercase tracking-[0.2em] text-neon">
              SiÂ­guenos
            </h4>
            <div className="flex items-center gap-4">
              <Link
                href="https://www.facebook.com/candeoruro"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <Image
                  src="/logos/facebook.svg"
                  alt="Facebook"
                  width={28}
                  height={28}
                />
              </Link>
              <Link
                href="https://www.instagram.com/candeoruro"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <Image
                  src="/logos/instagram.svg"
                  alt="Instagram"
                  width={28}
                  height={28}
                />
              </Link>
              <Link
                href="https://www.tiktok.com/@canoruro"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <Image
                  src="/logos/tiktok.svg"
                  alt="TikTok"
                  width={28}
                  height={28}
                />
              </Link>
              <Link
                href="https://wa.me/59173841415"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
              >
                <Image
                  src="/logos/whatsapp.svg"
                  alt="WhatsApp"
                  width={28}
                  height={28}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        ÃÂ© {new Date().getFullYear()} {institution.name}. Todos los derechos
        reservados.
      </div>
    </footer>
  );
};
