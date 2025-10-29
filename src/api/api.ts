import { Incident } from "../types/types";

export type ListResponse<T> = { items: T[]; total: number };

export async function fetchIncidents(
  filters: Partial<Omit<Incident, "id" | "owner" | "timestamp">>,
  options: { page: number; pageSize: number }
): Promise<ListResponse<Incident>> {
  const params = new URLSearchParams({ ...(filters as any), page: String(options.page), pageSize: String(options.pageSize) }).toString();
  const res = await fetch(`/api/incidents?${params}`);
  if (!res.ok) throw new Error("Failed to fetch incidents");
  return res.json();
}

export async function acknowledgeIncident(id: string): Promise<void> {
  const res = await fetch(`/api/incidents/${id}/acknowledge`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Acknowledge failed");
}

export async function resolveIncident(id: string): Promise<void> {
  const res = await fetch(`/api/incidents/${id}/resolve`, { method: "POST" });
  if (!res.ok) throw new Error("Resolve failed");
}
