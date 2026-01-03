import { OrdemServico } from "@/lib/tipos"
import { apiGet, apiPost, apiPatch } from "./api"

// Buscar detalhes de uma ordem de serviço por ID
export async function getOrdemServicoById(id: number | string) {
  return apiGet<OrdemServico>(`/ordem_servicos/${id}`)
}

// Buscar todas as ordens de serviço
export async function getOrdensServico(): Promise<OrdemServico[]> {
  return apiGet<OrdemServico[]>("/ordem_servicos")
}

export async function createOrdemServico(ordem: any): Promise<OrdemServico> {
  return apiPost<OrdemServico>("/ordem_servicos", ordem)
}

// Atualizar o status de uma ordem de serviço
export async function updateOrdemServicoStatus(id: number | string, status_id: number) {
  return apiPatch<OrdemServico>(`/ordem_servicos/${id}/update_status`, { status_id })
}

