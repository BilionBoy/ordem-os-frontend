import type { Equipamento } from "@/lib/tipos"
import { apiGet, apiPost } from "./api"

export type NovoEquipamentoPayload = {
  marca: string
  btus: string
  local_instalacao: string
  observacao?: string
  cliente_id: number
}

// Busca equipamentos de um cliente via query parameter
export async function getEquipamentosByCliente(clienteId: number): Promise<Equipamento[]> {
  return apiGet<Equipamento[]>(`/equipamentos?cliente_id=${clienteId}`, { cache: "no-store" })
}

// Cadastra equipamento
export async function createEquipamento(data: NovoEquipamentoPayload): Promise<Equipamento & { id: number }> {
  return apiPost<Equipamento & { id: number }>("/equipamentos", data)
}