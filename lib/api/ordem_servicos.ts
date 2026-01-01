import { OrdemServico } from "@/lib/tipos"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

// Buscar detalhes de uma ordem de serviço por ID
export async function getOrdemServicoById(id: number | string) {
  const response = await fetch(`${API_BASE_URL}/ordem_servicos/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  if (!response.ok) {
    throw new Error("Erro ao buscar detalhes da ordem de serviço")
  }
  console.log("Response ordem_servicos/:id =", response)
  return response.json()
}
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

// Atualizar o status de uma ordem de serviço
export async function updateOrdemServicoStatus(id: number | string, status_id: number) {
  const response = await fetch(`${API_BASE_URL}/ordem_servicos/${id}/update_status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status_id }),
  })
  if (!response.ok) {
    throw new Error("Erro ao atualizar o status da ordem de serviço")
  }
  return response.json()
}

