import { notFound } from "next/navigation";

export default async function CatchAll({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  notFound();
}
