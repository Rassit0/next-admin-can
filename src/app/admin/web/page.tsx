import { HeaderPage } from "@/ui";

export default function AdminWebPage() {
  return (
    <>
      <HeaderPage
        title="Web Pública"
        description="Gestión del portal web público."
        breadcrumb={[
          { label: "Web Pública" },
        ]}
      />
      <div>
        <h1>Admin Web</h1>
      </div>
    </>
  );
}
