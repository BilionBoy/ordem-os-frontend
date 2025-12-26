import type { Status } from "@/lib/tipos"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

export type StatusPayload = {
  nome: string
}

export async function getPrioridades(): Promise<Status[]> {
  const response = await fetch(`${API_BASE_URL}/prioridades`, { cache: "no-store" })
  if (!response.ok) throw new Error("Erro ao buscar prioridades")
  return response.json()
}

