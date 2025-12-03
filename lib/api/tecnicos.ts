import type { Tecnico } from "@/lib/tipos"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

export type NovoTecnicoPayload = {
  nome: string
  telefone: string
  especialidades: string[]
}

export async function getTecnicos(): Promise<Tecnico[]> {
  const response = await fetch(`${API_BASE_URL}/tecnicos`, { cache: "no-store" })
  if (!response.ok) throw new Error("Erro ao buscar técnicos")
  return response.json()
}

export async function getTecnicoById(id: string): Promise<Tecnico> {
  const response = await fetch(`${API_BASE_URL}/tecnicos/${id}`)
  if (!response.ok) throw new Error("Erro ao buscar técnico")
  return response.json()
}

export async function createTecnico(data: NovoTecnicoPayload): Promise<Tecnico> {
  const response = await fetch(`${API_BASE_URL}/tecnicos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const msg = await response.text().catch(() => "")
    throw new Error(msg || "Erro ao criar técnico")
  }
  return response.json()
}

export async function updateTecnico(id: string, data: Partial<NovoTecnicoPayload>): Promise<Tecnico> {
  const response = await fetch(`${API_BASE_URL}/tecnicos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Erro ao atualizar técnico")
  return response.json()
}

export async function deleteTecnico(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tecnicos/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Erro ao deletar técnico")
}