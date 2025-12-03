"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Cliente, Telefone, Endereco } from "@/lib/tipos"
import { getClientes } from "@/lib/api/clientes"
import { createCliente } from "@/lib/api/clientes"
import { Plus, Edit, Trash2, Phone, Mail, MapPin } from "lucide-react"

export default function ListaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // estado do novo cliente
  const [novoCliente, setNovoCliente] = useState<{
    nome: string
    email?: string
    telefones: { numero: string }[]
    enderecos: { logradouro: string; cidade?: string; estado?: string; cep?: string }[]
  }>({
    nome: "",
    email: "",
    telefones: [{ numero: "" }],
    enderecos: [{ logradouro: "", cidade: "", estado: "", cep: "" }],
  })

  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // helpers para telefone/endereço
  const addTelefone = () =>
    setNovoCliente((s) => ({ ...s, telefones: [...s.telefones, { numero: "" }] }))
  const removeTelefone = (idx: number) =>
    setNovoCliente((s) => ({ ...s, telefones: s.telefones.filter((_, i) => i !== idx) }))
  const updateTelefone = (idx: number, numero: string) =>
    setNovoCliente((s) => {
      const arr = [...s.telefones]
      arr[idx] = { numero }
      return { ...s, telefones: arr }
    })

  const addEndereco = () =>
    setNovoCliente((s) => ({
      ...s,
      enderecos: [...s.enderecos, { logradouro: "", cidade: "", estado: "", cep: "" }],
    }))
  const removeEndereco = (idx: number) =>
    setNovoCliente((s) => ({ ...s, enderecos: s.enderecos.filter((_, i) => i !== idx) }))
  const updateEndereco = (
    idx: number,
    field: "logradouro" | "cidade" | "estado" | "cep",
    value: string,
  ) =>
    setNovoCliente((s) => {
      const arr = [...s.enderecos]
      arr[idx] = { ...arr[idx], [field]: value }
      return { ...s, enderecos: arr }
    })

  const resetNovoCliente = () =>
    setNovoCliente({
      nome: "",
      email: "",
      telefones: [{ numero: "" }],
      enderecos: [{ logradouro: "", cidade: "", estado: "", cep: "" }],
    })

  const handleAddCliente = async () => {
    try {
      setSaving(true)
      const criado = await createCliente({
        nome: novoCliente.nome.trim(),
        email: novoCliente.email?.trim() || null,
        telefones: novoCliente.telefones.filter(t => t.numero.trim()).map(t => ({ numero: t.numero.trim() })),
        enderecos: novoCliente.enderecos
          .filter(e => e.logradouro.trim())
          .map(e => ({
            logradouro: e.logradouro.trim(),
            cidade: e.cidade?.trim(),
            estado: e.estado?.trim(),
            cep: e.cep?.trim(),
          })),
      })
      // Atualiza lista localmente (ou re-fetch se preferir)
      setClientes(prev => [criado, ...prev])
      resetNovoCliente()
      setOpen(false)
    } catch (e) {
      console.error(e)
      setError("Erro ao criar cliente")
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    async function fetchClientes() {
      try {
        setLoading(true)
        const data = await getClientes()
        setClientes(data)
      } catch (err) {
        setError("Erro ao carregar clientes")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchClientes()
  }, [])

  if (loading) return <div className="p-6">Carregando...</div>
  if (error) return <div className="p-6 text-destructive">{error}</div>

  const clientesFiltrados = clientes.filter(
    (c) => c.nome.toLowerCase().includes(busca.toLowerCase()) || c.email.toLowerCase().includes(busca.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Clientes</h1>
          <p className="text-muted-foreground">Gerencie os clientes cadastrados</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              <DialogDescription>Preencha os dados do novo cliente</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Nome do cliente"
                value={novoCliente.nome}
                onChange={(e) => setNovoCliente((s) => ({ ...s, nome: e.target.value }))}
              />
              <Input
                placeholder="E-mail (opcional)"
                value={novoCliente.email ?? ""}
                onChange={(e) => setNovoCliente((s) => ({ ...s, email: e.target.value }))}
              />

              {/* Telefones */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Telefones</span>
                  <Button type="button" variant="secondary" size="sm" onClick={addTelefone}>
                    + Telefone
                  </Button>
                </div>
                {novoCliente.telefones.map((t, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      placeholder="Número (ex: 11999999999)"
                      value={t.numero}
                      onChange={(e) => updateTelefone(idx, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="shrink-0"
                      onClick={() => removeTelefone(idx)}
                      disabled={novoCliente.telefones.length === 1}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>

              {/* Endereços */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Endereços</span>
                  <Button type="button" variant="secondary" size="sm" onClick={addEndereco}>
                    + Endereço
                  </Button>
                </div>
                {novoCliente.enderecos.map((e, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <Input
                      placeholder="Logradouro"
                      value={e.logradouro}
                      onChange={(ev) => updateEndereco(idx, "logradouro", ev.target.value)}
                    />
                    <Input
                      placeholder="Cidade"
                      value={e.cidade ?? ""}
                      onChange={(ev) => updateEndereco(idx, "cidade", ev.target.value)}
                    />
                    <Input
                      placeholder="Estado"
                      value={e.estado ?? ""}
                      onChange={(ev) => updateEndereco(idx, "estado", ev.target.value)}
                    />
                    <Input
                      placeholder="CEP"
                      value={e.cep ?? ""}
                      onChange={(ev) => updateEndereco(idx, "cep", ev.target.value)}
                    />
                    <div className="md:col-span-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeEndereco(idx)}
                        disabled={novoCliente.enderecos.length === 1}
                      >
                        Remover endereço
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="w-full"
                type="button"
                onClick={handleAddCliente}
                disabled={saving || !novoCliente.nome.trim()}
              >
                {saving ? "Salvando..." : "Adicionar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtrar</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Buscar por nome ou telefone..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total: {clientesFiltrados.length} clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Data Registro</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientesFiltrados.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {cliente.telefones.map(t => t.numero).join(", ")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm max-w-xs truncate">{cliente.enderecos.map(e => e.logradouro).join(", ")}</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(cliente.created_at).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
