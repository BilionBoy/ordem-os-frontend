// Buscar todas as ordens de serviço
export async function getOrdensServico(): Promise<OrdemServico[]> {
  const response = await fetch(`${API_BASE_URL}/ordem_servicos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  if (!response.ok) {
    throw new Error("Erro ao buscar ordens de serviço")
  }
  return response.json()
}
import { OrdemServico } from "@/lib/tipos"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

export async function createOrdemServico(ordem: any): Promise<OrdemServico> {
  const response = await fetch(`${API_BASE_URL}/ordem_servicos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ordem),
  })
  if (!response.ok) {
    throw new Error("Erro ao criar ordem de serviço")
  }
  return response.json()
}
