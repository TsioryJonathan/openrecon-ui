"use client";

import { use } from "react";
import { InvestigationDetail } from "@/components/investigations/InvestigationDetail";

export default function InvestigationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <InvestigationDetail investigationId={id} />;
}
