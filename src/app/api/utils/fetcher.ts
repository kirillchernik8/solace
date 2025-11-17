
export async function fetchHttp<Response>(url: string, method: "POST" | "GET", body?: Record<string, unknown>) {
  const response = await fetch(url,  {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })

  return response.json() as Response;
}
