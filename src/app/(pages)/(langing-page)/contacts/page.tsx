"use client";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "@/components/mols/providers";
import { TableViewLayout } from "@/components/pages/table";
import { Legislation, Mp } from "@/lib/prisma/types";

export default function LegislationsPage() {
  const { legislations } = useContext<{
    mps: Mp[];
    legislations: Legislation[];
  }>(DataContext);

  // render
  return (
    <TableViewLayout
      title="Legislations"
      link="Legislations"
      desc="Bills and Acts of Kenyan Parliament"
      items={legislations.map(
        ({ id, title, description, status, type, Debate }) => ({
          id,
          title,
          description,
          status,
          type,
          Debate,
        })
      )}
      headers={[
        "Icon",
        "Legislation",
        "Description",
        "Status",
        "Type",
        "Contributions",
      ]}
    />
  );
}
