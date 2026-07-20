import { HeaderPage } from "@/ui";

export default function AddPassPage() {
  return (
    <>
      <HeaderPage
        title="Nuevo Pase"
        description="Registrar un nuevo pase para el jugador."
        breadcrumb={[
          { label: "Jugadores", href: "/admin/players" },
          { label: "Kardex", href: ".." },
          { label: "Nuevo Pase" },
        ]}
      />
      <div>
        <h1>Hello Page</h1>
      </div>
    </>
  );
}
