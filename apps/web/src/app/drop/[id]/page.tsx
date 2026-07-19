"use client";

import { useParams } from "next/navigation";
import { FlightExperience } from "@/components/flight/flight-experience";

export default function DropPage() {
  const params = useParams<{ id: string }>();
  return <FlightExperience key={params.id} dropId={params.id} />;
}
