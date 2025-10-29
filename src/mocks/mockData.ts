import type { Incident } from "../types/types";

const owners = ["Abhishek", "Rahul", "Tarun", "Sunil", "Sandeep", "Akash"];
const services = ["API", "DB", "Web", "Infra"];
const severities: Incident["severity"][] = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateIncident(idNum: number): Incident {
  const createdAt = new Date(Date.now() - Math.floor(Math.random() * 86400000));
  return {
    id: String(idNum),
    severity: randomItem(severities),
    service: randomItem(services),
    status: "open",
    owner: randomItem(owners),
    timestamp: createdAt.toISOString(),
  };
}

let nextId = 11;
export const incidentStore: Incident[] = Array.from({ length: 10 }, (_, i) =>
  generateIncident(i + 1)
);

export type IncidentFilters = Partial<Omit<Incident, "id" | "owner" | "timestamp">>;

export function listIncidents(
  filters: IncidentFilters = {},
  page = 1,
  pageSize = 20
): { items: Incident[]; total: number } {
  const filtered = incidentStore.filter((i) => {
    if (filters.severity && i.severity !== filters.severity) return false;
    if (filters.service && i.service !== filters.service) return false;
    if (filters.status && i.status !== filters.status) return false;
    return true;
  });
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return { items, total: filtered.length };
}

export function acknowledge(id: string): void {
  const idx = incidentStore.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error("Incident not found");
  // In a real system, acknowledge might set owner or an ack flag; we keep simple.
  incidentStore[idx] = { ...incidentStore[idx] };
}

export function resolve(id: string): Incident {
  const idx = incidentStore.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error("Incident not found");
  incidentStore[idx] = { ...incidentStore[idx], status: "resolved" };
  return incidentStore[idx];
}

export function createRandomIncident(): Incident {
  const incident: Incident = {
    id: String(nextId++),
    severity: randomItem(severities),
    service: randomItem(services),
    status: "open",
    owner: randomItem(owners),
    timestamp: new Date().toISOString(),
  };
  incidentStore.unshift(incident);
  return incident;
}

export function updateRandomIncident(): Incident | null {
  if (incidentStore.length === 0) return null;
  const openIncidents = incidentStore.filter((i) => i.status === "open");
  const target = openIncidents.length
    ? randomItem(openIncidents)
    : randomItem(incidentStore);
  const idx = incidentStore.findIndex((i) => i.id === target.id);
  if (idx === -1) return null;
  const updated: Incident = {
    ...target,
    severity: randomItem(severities),
    timestamp: new Date().toISOString(),
  };
  incidentStore[idx] = updated;
  return updated;
}
