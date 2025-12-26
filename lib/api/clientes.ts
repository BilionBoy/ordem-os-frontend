import type { Cliente } from "@/lib/tipos"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"

export type NovoClientePayload = {
  nome: string
  email?: string | null
  telefones_attributes: { numero: string }[]
  enderecos_attributes: { rua: string; numero: string; bairro: string; complemento?: string; cidade: string }[]
}

export async function getClientes(): Promise<Cliente[]> {
  const response = await fetch(`${API_BASE_URL}/clientes`, { cache: "no-store" })
  if (!response.ok) throw new Error("Erro ao buscar clientes")
  return response.json()
}

export async function getClienteById(id: string): Promise<Cliente> {
  const response = await fetch(`${API_BASE_URL}/clientes/${id}`)
  if (!response.ok) {
    throw new Error("Erro ao buscar cliente")
  }
  return response.json()
}

export async function createCliente(data: NovoClientePayload): Promise<Cliente> {
  const response = await fetch(`${API_BASE_URL}/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const msg = await response.text().catch(() => "")
    throw new Error(msg || "Erro ao criar cliente")
  }
  return response.json()
}

export async function updateCliente(id: string, data: Partial<Cliente>): Promise<Cliente> {
  const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error("Erro ao atualizar cliente")
  }
  return response.json()
}

export async function deleteCliente(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Erro ao deletar cliente")
  }
}