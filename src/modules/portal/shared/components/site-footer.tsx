import Link from "next/link";
import { Crest } from "./crest";

import { navLinks } from "@/modules/portal/core/constants/navigation";
import { Institution } from "@/modules/portal/institutions/interfaces/institution.interface";

export const SiteFooter = ({ institution }: { institution: Institution }) => {
  const defaultContact =
    institution.contacts?.find((c) => c.isDefault) ||
    institution.contacts?.[0];

  return (
    <footer className="relative z-10 border-t border-border bg-oxford text-white">
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
                {institution.name} · {new Date(institution.createdAt).getFullYear()}
              </span>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Institución polideportiva. Formando deportistas y comunidad desde
            hace casi nueve décadas.
          </p>
        </div>

        <div>
          <h4 className="font-heading text-sm font-700 uppercase tracking-[0.2em] text-neon">
            Navegación
          </h4>
          <ul className="mt-4 space-y-2">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-white/70 transition-colors hover:text-neon"
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
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>{institution.address}</li>
            {defaultContact?.email && <li>{defaultContact.email}</li>}
            {defaultContact?.phone && <li>{defaultContact.phone}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {institution.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
};
