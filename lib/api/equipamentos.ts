import type { Equipamento } from "@/lib/tipos"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

export type NovoEquipamentoPayload = {
  marca: string
  btus: string
  local_instalacao: string
  observacao?: string
  cliente_id: number
}

// Busca equipamentos de um cliente via query parameter
export async function getEquipamentosByCliente(clienteId: number): Promise<Equipamento[]> {
  const res = await fetch(`${API_BASE_URL}/equipamentos?cliente_id=${clienteId}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Erro ao buscar equipamentos do cliente")
  return res.json()
}

// Cadastra equipamento
export async function createEquipamento(data: NovoEquipamentoPayload): Promise<Equipamento & { id: number }> {
  const res = await fetch(`${API_BASE_URL}/equipamentos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => "")
    throw new Error(msg || "Erro ao criar equipamento")
  }
  return res.json()
}