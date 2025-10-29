import { acknowledge, listIncidents, resolve } from "./mockData";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function setupMockApi() {
  // Idempotent setup
  if ((window as any).__mockApiInstalled) return;
  (window as any).__mockApiInstalled = true;

  const origFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    const method = (init?.method || "GET").toUpperCase();

    if (url.startsWith("/api/incidents")) {
      try {
        // Simulate network latency
        await delay(200 + Math.random() * 300);

        // GET /api/incidents?severity=&service=&status=
        if ((method === "GET" && url === "/api/incidents") || (method === "GET" && url.startsWith("/api/incidents?"))) {
          const u = new URL(url, window.location.origin);
          const params = Object.fromEntries(u.searchParams.entries()) as any;
          const page = parseInt(params.page ?? '1', 10) || 1;
          const pageSize = parseInt(params.pageSize ?? '20', 10) || 20;
          const { page: _p, pageSize: _ps, ...filters } = params;
          const data = listIncidents(filters, page, pageSize);
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        // POST /api/incidents/:id/acknowledge
        const ackMatch = url.match(/^\/api\/incidents\/([^/]+)\/acknowledge$/);
        if (method === "POST" && ackMatch) {
          acknowledge(ackMatch[1]);
          return new Response(null, { status: 204 });
        }

        // POST /api/incidents/:id/resolve
        const resMatch = url.match(/^\/api\/incidents\/([^/]+)\/resolve$/);
        if (method === "POST" && resMatch) {
          resolve(resMatch[1]);
          return new Response(null, { status: 204 });
        }

        // Fallback 404 for unknown mock api route
        return new Response(JSON.stringify({ message: "Not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      } catch (e) {
        return new Response(JSON.stringify({ message: "Mock API error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Non-mock routes fall back to original fetch
    return origFetch(input as any, init);
  };
}

