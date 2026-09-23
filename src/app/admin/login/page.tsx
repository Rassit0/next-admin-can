import { redirect } from "next/navigation";

export default function LegacyLoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params = new URLSearchParams();
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (typeof value === "string") {
        params.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      }
    });
  }

  const queryString = params.toString() ? `?${params.toString()}` : "";
  redirect(`/login${queryString}`);
}
