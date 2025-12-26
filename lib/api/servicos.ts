import type { Servico } from "@/lib/tipos"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

export type NovoServicoPayload = {
  nome: string
  valor: number
}

export async function getServicos(): Promise<Servico[]> {
  const response = await fetch(`${API_BASE_URL}/servicos`, { cache: "no-store" })
  if (!response.ok) throw new Error("Erro ao buscar serviços")
  return response.json()
}

export async function getServicoById(id: string): Promise<Servico> {
  const response = await fetch(`${API_BASE_URL}/servicos/${id}`)
  if (!response.ok) throw new Error("Erro ao buscar serviço")
  return response.json()
}

export async function createServico(data: NovoServicoPayload): Promise<Servico> {
  const response = await fetch(`${API_BASE_URL}/servicos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const msg = await response.text().catch(() => "")
    throw new Error(msg || "Erro ao criar serviço")
  }
  return response.json()
}

export async function updateServico(id: string, data: Partial<NovoServicoPayload>): Promise<Servico> {
  const response = await fetch(`${API_BASE_URL}/servicos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Erro ao atualizar serviço")
  return response.json()
}

export async function deleteServico(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/servicos/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Erro ao deletar serviço")
}