import { HeaderPage } from "@/ui";

export default function AttendancePage() {
  return (
    <>
      <HeaderPage
        title="Asistencias"
        description="Gestión y control de asistencias."
        breadcrumb={[
          { label: "Asistencias" },
        ]}
      />
      <div>
        <h1>AttendancesPage Page</h1>
      </div>
    </>
  );
}
