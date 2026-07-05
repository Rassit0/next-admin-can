import { findPersonById } from "@/modules/persons";
import { Button, Card, Switch } from "@heroui/react";
import {
  AddCircleFreeIcons,
  AddMaleIcon,
  Analytics01Icon,
  BasketballIcon,
  Calendar03Icon,
  Calendar05Icon,
  Call02Icon,
  CameraAdd01Icon,
  CheckmarkBadge02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Edit03Icon,
  IdentityCardIcon,
  MoreVerticalSquare01Icon,
  Share01Icon,
  Tick02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { notFound } from "next/navigation";

const ErrorComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <h2 className="text-xl font-bold">Hubo un problema</h2>
      <p className="text-gray-600">No se encontro el registro</p>
    </div>
  );
};

export default async function MemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (isNaN(Number(id))) {
    return <ErrorComponent />;
  }

  const response = await findPersonById({ id: Number(id) });

  if ((response.error && response.statusCode !== 200) || !response.data) {
    return <ErrorComponent />;
  }

  const { data: person } = response;
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* <!-- Hero Section: Identity & Stats --> */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8 flex flex-col md:flex-row items-center md:items-end gap-8">
          <div className="relative group">
            <div className="absolute inset-0 athletic-gradient rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <img
              alt="Mateo Velásquez Hincapié"
              className="relative w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl"
              data-alt="Portrait of Mateo Velasquez, a young athletic man with dark hair, confident expression, soft natural lighting"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3Qe2YeNO9xDkZEo9MX-WD0APSxLU0RZzpRfTCp5m-TDx8gCmaUmxXFN76QEeO0Tv4ObDqmRnWrhojoWPW5abwN-vEfZMzYwvotcy7gzr813ytfW4YlQx6DIK7VuLyWp6mRoXbXWMTd-tkmNIukCCvFQB29irYjQjwvlIE9RtkPXFijFmTxnYwhLDygsvIhBJEUa4kS7O-ny4LCM9GsQKPPClwNJhH7U4fAaqA9801l6Nu4pB9OT-dPC_Mb7OTlKwGcjFv53Xb0bns"
            />
            <button className="absolute bottom-2 right-2 p-2 bg-accent-foreground rounded-full shadow-lg hover:scale-110 transition-transform">
              <HugeiconsIcon
                icon={CameraAdd01Icon}
                className="text-accent h-8 w-8"
              />
            </button>
          </div>
          <div className="text-center md:text-left pb-2">
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-1">
              <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">
                {person.name} {person.lastName} {person.secondLastName}
              </h1>
              <span className="bg-accent/40 text-accent px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <HugeiconsIcon icon={CheckmarkBadge02Icon} />
                ELITE
              </span>
            </div>
            <p className="text-on-surface-variant font-medium flex items-center gap-2 justify-center md:justify-start">
              <span className="text-primary font-bold">ID: {person.id}</span>
              <span className="text-outline-variant">•</span>
              <span>
                Afiliado desde:{" "}
                {person.createdAt.toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
              <button className="bg-accent text-foreground px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2">
                <HugeiconsIcon icon={Edit03Icon} /> Editar Perfil
              </button>
              <button className="bg-background-secondary border border-outline-variant/30 text-foreground px-6 py-2.5 rounded-xl font-bold hover:bg-surface-container-low transition-all flex items-center gap-2">
                <HugeiconsIcon icon={Share01Icon} /> Exportar Ficha
              </button>
            </div>
          </div>
        </div>
        {/* <!-- Quick Stats Grid --> */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          <div className="bg-background-secondary p-4 rounded-xl shadow-sm border-l-4 border-primary">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">
              Asistencia
            </p>
            <h3 className="text-2xl font-black text-primary">94.2%</h3>
            <p className="text-[11px] text-tertiary font-medium">
              Top 5% del club
            </p>
          </div>
          <div className="bg-background-secondary p-4 rounded-xl shadow-sm border-l-4 border-tertiary-container">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">
              Pagos
            </p>
            <h3 className="text-2xl font-black text-tertiary">Al Día</h3>
            <p className="text-[11px] text-on-surface-variant">
              Próximo: 05 Abr
            </p>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* <!-- Main Column: Profile Management & Connections --> */}
        <div className="lg:col-span-8 space-y-12">
          {/* <!-- Section: Profiles --> */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight">
                Gestión de Perfiles
              </h2>
              <button className="bg-accent text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/10 hover:bg-primary-container transition-all active:scale-95">
                <HugeiconsIcon icon={AddCircleFreeIcons} /> Añadir Perfil
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                {/* <CircleDollar aria-label="Dollar sign icon" className="text-primary size-6" role="img" /> */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-accent-foreground rounded-xl flex items-center justify-center">
                      <HugeiconsIcon
                        icon={IdentityCardIcon}
                        className="text-accent size-8"
                      />
                    </div>
                    <Card.Header>
                      <Card.Title className="text-xs font-bold uppercase">
                        Empleado
                      </Card.Title>
                      <Card.Description className="text-lg font-bold">
                        Analista de Rendimiento
                      </Card.Description>
                    </Card.Header>
                  </div>
                  <Button aria-label="Menu" isIconOnly variant="ghost">
                    <HugeiconsIcon icon={MoreVerticalSquare01Icon} />
                  </Button>
                </div>
                <Card.Content className="flex justify-center">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">
                        Departamento
                      </span>
                      <span className="font-semibold">Área Deportiva</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Contrato</span>
                      <span className="font-semibold">Tiempo Completo</span>
                    </div>
                  </div>
                </Card.Content>
                <Card.Footer className="px-4 flex items-center justify-between pt-4 border-t border-surface-container-low">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-tertiary">
                    <span className="w-2 h-2 rounded-full bg-success"></span>{" "}
                    ACTIVO
                  </span>
                  <Switch aria-label="Enable notifications">
                    <Switch.Control className="bg-success">
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch>
                </Card.Footer>
              </Card>

              {/* <!-- Profile Card: PLAYER --> */}
              <Card>
                {/* <CircleDollar aria-label="Dollar sign icon" className="text-primary size-6" role="img" /> */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-accent-foreground rounded-xl flex items-center justify-center">
                      <HugeiconsIcon
                        icon={BasketballIcon}
                        className="text-accent size-8"
                      />
                    </div>
                    <Card.Header>
                      <Card.Title className="text-xs font-bold uppercase">
                        Jugador
                      </Card.Title>
                      <Card.Description className="text-lg font-bold">
                        Baloncesto U-20
                      </Card.Description>
                    </Card.Header>
                  </div>
                  <Button aria-label="Menu" isIconOnly variant="ghost">
                    <HugeiconsIcon icon={MoreVerticalSquare01Icon} />
                  </Button>
                </div>
                <Card.Content className="flex justify-center">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Categoría</span>
                      <span className="font-semibold">U-20</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-on-surface-variant">Deporte</span>
                      <span className="font-semibold">Baloncesto</span>
                    </div>
                  </div>
                </Card.Content>
                <Card.Footer className="px-4 flex items-center justify-between pt-4 border-t border-surface-container-low">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-tertiary">
                    <span className="w-2 h-2 rounded-full bg-success"></span>{" "}
                    ACTIVO
                  </span>
                  <Switch aria-label="Enable notifications">
                    <Switch.Control className="bg-success">
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch>
                </Card.Footer>
              </Card>

              {/* <div className="bg-background-secondary rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden border-l-4 border-primary border-t border-r border-b border-slate-100">
                <div className="absolute top-0 right-0 p-4">
                  <button className="text-outline hover:text-on-surface">
                    <span
                      className="material-symbols-outlined"
                      data-icon="more_vert"
                    >
                      more_vert
                    </span>
                  </button>
                </div>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-primary">
                    <span
                      className="material-symbols-outlined text-2xl"
                      data-icon="sports_basketball"
                    >
                      sports_basketball
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">
                      Jugador
                    </p>
                    <h3 className="text-lg font-bold">Baloncesto U-20</h3>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Categoría</span>
                    <span className="font-semibold">Elite</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Partidos</span>
                    <span className="font-semibold">24 Jugados</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-surface-container-low">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-tertiary">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>{" "}
                    ACTIVO
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background-secondary after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div> */}
            </div>
          </section>
          {/* <!-- Section: Family Links --> */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight">
                Vínculos Familiares
              </h2>
              <button className="bg-background-tertiary text-primary border-2 border-primary/20 px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/5 transition-all active:scale-95">
                <HugeiconsIcon icon={AddMaleIcon} /> Añadir Familiar
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <!-- Relative 1 --> */}
              {/* <!-- Profile Card: PLAYER --> */}
              <Card>
                {/* <CircleDollar aria-label="Dollar sign icon" className="text-primary size-6" role="img" /> */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      alt="Elena"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
                      data-alt="Portrait of a young woman with smiling face, long dark hair, natural lighting, outdoors"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_nMZQ-6ls3HjdX7qElNrabAXdH4uM-IAS1mHRIx8mCSTyfy44ta6wbSQuByLuu3LAhgrnia7EhuUH8PxxYZ_BgSbBKpRO7EJ8T7-uMzseuaR_usenTRZrgVf132o5cl8zdszbJVGz-_sAeqweV6HjfFEtONV8NErX1tSqSIBmfBuhCl-XZzpmZg92yZT5F5tnusluTFDRpihggPvwC19SG9IHyaG2msf5InhH5Cr0O_bWQKAZCZDwP7JQrTJM5e8kixytka8Uejb5"
                    />
                    <Card.Header>
                      <Card.Title className="text-lg text-foreground/50 font-bold uppercase">
                        Elena Velásquez
                      </Card.Title>
                      <Card.Description className="text-sm text-foreground font-bold">
                        Hermana • Afiliado Jugador
                      </Card.Description>
                    </Card.Header>
                  </div>
                  <div className="bg-border-secondary rounded-full p-1">
                    <HugeiconsIcon icon={Tick02Icon} />
                  </div>
                </div>
                <Card.Content className="flex justify-center">
                  <div className="bg-background-secondary rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-danger mb-0.5">
                        Contacto de Emergencia
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        +57 301 456 7890
                      </p>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform">
                      <HugeiconsIcon icon={Call02Icon} />
                    </button>
                  </div>
                </Card.Content>
              </Card>

              <Card>
                {/* <CircleDollar aria-label="Dollar sign icon" className="text-primary size-6" role="img" /> */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      alt="Roberto"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
                      data-alt="Middle-aged man with short hair and glasses, wearing a polo shirt, looking friendly, neutral background"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_DGM6K7H6fFDMY1iydOHTmglUrAtIUXAScAzX6tLwziT8E4Y7gb4FKAENhu7kdIOgOOLASnTAWv5KxI7EwayZzZPuJbOT-Iz5HzkP6CjGuWuB4CKgovAB5lHWtrhVdbwFnkNyfZhDxbtVlWdeVlpZ4U5-rB_6RB6kNFCVSwi72gX6AcHpKtBAVxKUW8q4ifPGqMdb920_ulOSqwUTUoDsDtBywmWSMZ_GGKZrBMahuCQTRhSMbv9LSKOnF1uQhvMkTL161AT5sLGv"
                    />
                    <Card.Header>
                      <Card.Title className="text-lg text-foreground/50 font-bold uppercase">
                        Roberto Velásquez
                      </Card.Title>
                      <Card.Description className="text-sm text-foreground font-bold">
                        Padre • Socio Vitalicio
                      </Card.Description>
                    </Card.Header>
                  </div>
                  <div className="bg-border-secondary rounded-full p-1">
                    <HugeiconsIcon icon={Tick02Icon} />
                  </div>
                </div>
                <Card.Content className="flex justify-center">
                  <div className="bg-background-secondary rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-danger mb-0.5">
                        Contacto de Emergencia
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        +57 301 456 7890
                      </p>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform">
                      <HugeiconsIcon icon={Call02Icon} />
                    </button>
                  </div>
                </Card.Content>
              </Card>

              {/* <div className="bg-background-secondary p-5 rounded-2xl flex flex-col gap-4 shadow-sm border border-slate-100 hover:border-primary-container/40 transition-all group">
                <div className="flex items-center gap-4">
                  <img
                    alt="Elena"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
                    data-alt="Portrait of a young woman with smiling face, long dark hair, natural lighting, outdoors"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_nMZQ-6ls3HjdX7qElNrabAXdH4uM-IAS1mHRIx8mCSTyfy44ta6wbSQuByLuu3LAhgrnia7EhuUH8PxxYZ_BgSbBKpRO7EJ8T7-uMzseuaR_usenTRZrgVf132o5cl8zdszbJVGz-_sAeqweV6HjfFEtONV8NErX1tSqSIBmfBuhCl-XZzpmZg92yZT5F5tnusluTFDRpihggPvwC19SG9IHyaG2msf5InhH5Cr0O_bWQKAZCZDwP7JQrTJM5e8kixytka8Uejb5"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">
                      Elena Velásquez
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      Hermana • Afiliado Jugador
                    </p>
                  </div>
                  <HugeiconsIcon icon={Tick02Icon} />
                </div>
                <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-error mb-0.5">
                      Contacto de Emergencia
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      +57 301 456 7890
                    </p>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform">
                    <span
                      className="material-symbols-outlined text-lg"
                      data-icon="call"
                    >
                      call
                    </span>
                  </button>
                </div>
              </div> */}
              {/* <!-- Relative 2 --> */}
              {/* <div className="bg-background-secondary p-5 rounded-2xl flex flex-col gap-4 shadow-sm border border-slate-100 hover:border-primary-container/40 transition-all group">
                <div className="flex items-center gap-4">
                  <img
                    alt="Roberto"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100"
                    data-alt="Middle-aged man with short hair and glasses, wearing a polo shirt, looking friendly, neutral background"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_DGM6K7H6fFDMY1iydOHTmglUrAtIUXAScAzX6tLwziT8E4Y7gb4FKAENhu7kdIOgOOLASnTAWv5KxI7EwayZzZPuJbOT-Iz5HzkP6CjGuWuB4CKgovAB5lHWtrhVdbwFnkNyfZhDxbtVlWdeVlpZ4U5-rB_6RB6kNFCVSwi72gX6AcHpKtBAVxKUW8q4ifPGqMdb920_ulOSqwUTUoDsDtBywmWSMZ_GGKZrBMahuCQTRhSMbv9LSKOnF1uQhvMkTL161AT5sLGv"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">
                      Roberto Velásquez
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      Padre • Socio Vitalicio
                    </p>
                  </div>
                  <span
                    className="material-symbols-outlined text-tertiary"
                    data-icon="check_circle"
                  >
                    check_circle
                  </span>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-error mb-0.5">
                      Contacto de Emergencia
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      +57 315 234 5678
                    </p>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform">
                    <span
                      className="material-symbols-outlined text-lg"
                      data-icon="call"
                    >
                      call
                    </span>
                  </button>
                </div>
              </div> */}
            </div>
          </section>
          {/* <!-- Section: Personas a Cargo (Dependents) --> */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold tracking-tight">
                  Personas a Cargo
                </h2>
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  Tutor Activo
                </span>
              </div>
            </div>
            <div className="bg-background-secondary rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Miembro
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Identificación
                    </th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Parentesco / Rol
                    </th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* <img
                          alt="Juan"
                          className="w-10 h-10 rounded-full object-cover shadow-sm"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH6mR2p_hEa9E-zZ66pG6D8z3T_B5i8O7Qn_9M_p9N-z5U8k3mR6e5R4I9P"
                        /> */}
                        <span className="font-bold text-slate-900">
                          Juan Pablo Velásquez
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-500">
                      CAN-102938
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        Hijo / Jugador Sub-12
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary font-bold text-sm hover:underline">
                        Ver Perfil
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* <img
                          alt="Camila"
                          className="w-10 h-10 rounded-full object-cover shadow-sm"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-p9D8z3T_B5i8O7Qn_9M_p9N-z5U8k3mR6e5R4I9P"
                        /> */}
                        <span className="font-bold text-slate-900">
                          Camila Velásquez
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-500">
                      CAN-445566
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        Hija / Jugadora Natación
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary font-bold text-sm hover:underline">
                        Ver Perfil
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
        {/* <!-- Sidebar Utility Column --> */}
        <div className="lg:col-span-4 space-y-8">
          {/* <!-- Administrative Summary Widget --> */}
          <div className="bg-background-secondary rounded-2xl p-6 shadow-sm space-y-8 border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg tracking-tight flex items-center gap-2 text-slate-900">
                <HugeiconsIcon icon={Analytics01Icon} className="text-accent" />
                <span className="text-default-foreground">
                  Resumen Administrativo
                </span>
              </h3>
            </div>
            {/* <!-- Enhanced Status Badge --> */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <div className="w-14 h-14 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-3">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className="size-10"
                />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
                Estado Administrativo
              </p>
              <h4 className="text-xl font-extrabold text-green-700">
                AL DÍA / EN REGLA
              </h4>
            </div>
            {/* <!-- Attendance Doughnut-style indicator --> */}
            <div className="flex items-center gap-6 p-4 bg-background-secondary rounded-xl border border-slate-100">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="attendance-ring absolute inset-0 rounded-full"></div>
                <div className="absolute inset-1 bg-background-secondary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">94.2%</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Asistencia Global
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  Rendimiento Excelente
                </p>
              </div>
            </div>
            {/* <!-- More Prominent Next Event Card --> */}
            <Card className="relative rounded-sm overflow-hidden group border-l-4 border-accent">
              <div className="flex items-center gap-2 mb-3">
                <HugeiconsIcon icon={Calendar05Icon} />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                  Próximo Evento
                </span>
              </div>
              <h4 className="text-lg font-bold text-foreground leading-tight mb-2">
                Torneo Nacional Interclubes
              </h4>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                  <HugeiconsIcon icon={Calendar03Icon} />
                  Viernes, 12 de Abril, 2024
                </p>
                <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                  <HugeiconsIcon icon={Clock01Icon} />
                  09:00 AM - Coliseo Central
                </p>
              </div>
            </Card>
            {/* <!-- Metrics Grid --> */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl text-center">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Antigüedad
                </p>
                <p className="text-xl font-extrabold text-slate-900 italic">
                  6.2 <span className="text-[10px] not-italic">años</span>
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl text-center">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  Compromiso
                </p>
                <p className="text-xl font-extrabold text-slate-900 italic">
                  Alta{" "}
                  <span
                    className="material-symbols-outlined text-sm text-primary"
                    data-icon="trending_up"
                  >
                    trending_up
                  </span>
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">
                Disciplinas
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
                  Baloncesto
                </span>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
                  Natación
                </span>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
                  Gimnasio
                </span>
              </div>
            </div>
          </div>
          {/* <!-- Documentation Widget --> */}
          <div className="bg-surface-container-low rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg tracking-tight">
                Documentación
              </h3>
              <span
                className="material-symbols-outlined text-on-surface-variant"
                data-icon="folder_open"
              >
                folder_open
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background-secondary rounded-xl border border-transparent hover:border-primary/20 transition-all cursor-pointer shadow-sm">
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-error"
                    data-icon="picture_as_pdf"
                  >
                    picture_as_pdf
                  </span>
                  <div>
                    <p className="text-sm font-bold leading-tight">
                      Examen Médico 2024
                    </p>
                    <p className="text-[10px] text-on-surface-variant">
                      Vence en 45 días
                    </p>
                  </div>
                </div>
                <span
                  className="material-symbols-outlined text-on-surface-variant text-sm"
                  data-icon="download"
                >
                  download
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background-secondary rounded-xl border border-transparent hover:border-primary/20 transition-all cursor-pointer shadow-sm">
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-primary"
                    data-icon="description"
                  >
                    description
                  </span>
                  <div>
                    <p className="text-sm font-bold leading-tight">
                      Contrato Laboral
                    </p>
                    <p className="text-[10px] text-on-surface-variant">
                      Firmado: 12/01/2024
                    </p>
                  </div>
                </div>
                <span
                  className="material-symbols-outlined text-on-surface-variant text-sm"
                  data-icon="visibility"
                >
                  visibility
                </span>
              </div>
            </div>
            <button className="w-full py-3 text-sm font-bold text-primary border-2 border-primary/20 rounded-xl hover:bg-primary/5 transition-colors">
              Ver todo el historial
            </button>
          </div>
          {/* <!-- Membership Card Preview --> */}
          <div className="relative h-48 athletic-gradient rounded-2xl p-6 overflow-hidden shadow-xl shadow-primary/30 group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-background-secondary/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500"></div>
            <div className="relative z-10 h-full flex flex-col justify-between text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
                    Carnet Digital
                  </p>
                  <h4 className="text-xl font-black italic">
                    CLUB ATLÉTICO NACIONAL
                  </h4>
                </div>
                <span
                  className="material-symbols-outlined text-3xl"
                  data-icon="contactless"
                >
                  contactless
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-medium opacity-70">Titular</p>
                  <p className="font-bold tracking-wide">MATEO VELÁSQUEZ H.</p>
                </div>
                <div className="w-12 h-12 bg-background-secondary p-1 rounded-lg">
                  <img
                    alt="Member QR Code"
                    className="w-full h-full"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRsKDYi8C5vnosgX0WZpIPuaExKUB4Xuer6vYH7E9DG8nCMc-YqZZmU5yFNWXdvuTBksnOpEAq9Co6tApnmnxMUr5ezDDOnd2C2FDbMXcS0zV6JCddx7NSuy33bTRvPK6OUlY_3xwojDFDspGVwynvgEv66N2-2O3hfc7PVEmc6MoJzFpmANrSsWx7JQHFNoxnwzn5LWIknhRIqfkROKsZtF3H1265REaQxj0X1d_gpkdzY3DLuZjiP2R4TbLdzpZLX8I2uEQe9vw7"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
