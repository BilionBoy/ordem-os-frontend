"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { OrdemServico, Cliente, Tecnico } from "@/lib/tipos"
import { ordensServico } from "@/lib/dados-mockados"
import { Search, Eye, Plus, Check, ChevronsUpDown, ExternalLink } from "lucide-react"
import { NaoEncontrado } from "./nao-encontrado"
import { getClientes } from "@/lib/api/clientes"
import { getTecnicos } from "@/lib/api/tecnicos"
import { cn } from "@/lib/utils"

export default function ListaOrdens() {
  const [ordens, setOrdens] = useState<OrdemServico[]>(ordensServico)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroPrioridade, setFiltroPrioridade] = useState("todos")
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Estado para clientes
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loadingClientes, setLoadingClientes] = useState(false)
  const [openClienteCombo, setOpenClienteCombo] = useState(false)

  // Estado para técnicos
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [loadingTecnicos, setLoadingTecnicos] = useState(false)
  const [openTecnicoCombo, setOpenTecnicoCombo] = useState(false)

  const [novaOrdem, setNovaOrdem] = useState({
    clienteId: "",
    tecnicoId: "",
    equipamentoId: "",
    tipoServico: "manutencao" as const,
    descricao: "",
    prioridade: "media" as const,
    dataVencimento: "",
    custoEstimado: "",
    notas: "",
  })

  // Carregar clientes ao abrir o dialog
  useEffect(() => {
    if (open && clientes.length === 0) {
      fetchClientes()
    }
    if (open && tecnicos.length === 0) {
      fetchTecnicos()
    }
  }, [open])

  const fetchClientes = async () => {
    try {
      setLoadingClientes(true)
      const data = await getClientes()
      setClientes(data)
    } catch (err) {
      console.error("Erro ao carregar clientes:", err)
    } finally {
      setLoadingClientes(false)
    }
  }

  const fetchTecnicos = async () => {
    try {
      setLoadingTecnicos(true)
      const data = await getTecnicos()
      setTecnicos(data)
    } catch (err) {
      console.error("Erro ao carregar técnicos:", err)
    } finally {
      setLoadingTecnicos(false)
    }
  }

  const resetNovaOrdem = () =>
    setNovaOrdem({
      clienteId: "",
      tecnicoId: "",
      equipamentoId: "",
      tipoServico: "manutencao",
      descricao: "",
      prioridade: "media",
      dataVencimento: "",
      custoEstimado: "",
      notas: "",
    })

  const handleAddOrdem = async () => {
    try {
      setSaving(true)
      // TODO: chamar API createOrdem
      const novaOrdemCriada: OrdemServico = {
        id: `OS-${Date.now()}`,
        numeroOrdem: `OS-${String(ordens.length + 1).padStart(4, "0")}`,
        clienteId: novaOrdem.clienteId,
        tecnicoId: novaOrdem.tecnicoId || undefined,
        equipamentoId: novaOrdem.equipamentoId || undefined,
        tipoServico: novaOrdem.tipoServico,
        descricao: novaOrdem.descricao,
        status: "pendente",
        prioridade: novaOrdem.prioridade,
        tarefas: [],
        dataAbertura: new Date().toISOString(),
        dataVencimento: novaOrdem.dataVencimento || undefined,
        notas: novaOrdem.notas,
        custoEstimado: novaOrdem.custoEstimado ? parseFloat(novaOrdem.custoEstimado) : undefined,
      }
      setOrdens((prev) => [novaOrdemCriada, ...prev])
      resetNovaOrdem()
      setOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const ordensFiltradas = useMemo(() => {
    return ordens.filter((ordem) => {
      const matchBusca =
        ordem.numeroOrdem.toLowerCase().includes(busca.toLowerCase()) ||
        ordem.descricao.toLowerCase().includes(busca.toLowerCase())
      const matchStatus = filtroStatus === "todos" || ordem.status === filtroStatus
      const matchPrioridade = filtroPrioridade === "todos" || ordem.prioridade === filtroPrioridade
      return matchBusca && matchStatus && matchPrioridade
    })
  }, [ordens, busca, filtroStatus, filtroPrioridade])

  const getBadgeStatus = (status: string) => {
    const cores: { [key: string]: string } = {
      pendente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
      em_progresso: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
      concluido: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
      cancelado: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
    }
    return cores[status] || ""
  }

  const getBadgePrioridade = (prioridade: string) => {
    const cores: { [key: string]: string } = {
      critica: "bg-red-500 text-white",
      alta: "bg-orange-500 text-white",
      media: "bg-yellow-500 text-white",
      baixa: "bg-blue-500 text-white",
    }
    return cores[prioridade] || ""
  }

  const clienteSelecionado = clientes.find((c) => String(c.id) === novaOrdem.clienteId)
  const tecnicoSelecionado = tecnicos.find((t) => String(t.id) === novaOrdem.tecnicoId)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ordens de Serviço</h1>
          <p className="text-muted-foreground">Visualize e gerencie todas as suas ordens</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Ordem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Ordem de Serviço</DialogTitle>
              <DialogDescription>Preencha os dados da nova ordem</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Combobox de Cliente */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Cliente *</label>
                    <Link
                      href="/clientes"
                      target="_blank"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Cadastrar novo cliente
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <Popover open={openClienteCombo} onOpenChange={setOpenClienteCombo}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openClienteCombo}
                        className="w-full justify-between"
                      >
                        {clienteSelecionado
                          ? `${clienteSelecionado.nome} ${clienteSelecionado.email ? `(${clienteSelecionado.email})` : ""}`
                          : "Selecione um cliente..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar cliente..." />
                        <CommandList>
                          <CommandEmpty>
                            {loadingClientes ? "Carregando..." : "Nenhum cliente encontrado."}
                          </CommandEmpty>
                          <CommandGroup>
                            {clientes.map((cliente) => (
                              <CommandItem
                                key={cliente.id}
                                value={`${cliente.nome} ${cliente.email || ""}`}
                                onSelect={() => {
                                  setNovaOrdem((s) => ({ ...s, clienteId: String(cliente.id) }))
                                  setOpenClienteCombo(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    String(cliente.id) === novaOrdem.clienteId ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium">{cliente.nome}</span>
                                  {cliente.email && (
                                    <span className="text-xs text-muted-foreground">{cliente.email}</span>
                                  )}
                                  {cliente.telefones?.[0] && (
                                    <span className="text-xs text-muted-foreground">{cliente.telefones[0].numero}</span>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Combobox de Técnico */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Técnico</label>
                    <Link
                      href="/tecnicos"
                      target="_blank"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Cadastrar novo técnico
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <Popover open={openTecnicoCombo} onOpenChange={setOpenTecnicoCombo}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openTecnicoCombo}
                        className="w-full justify-between"
                      >
                        {tecnicoSelecionado
                          ? `${tecnicoSelecionado.nome} - ${tecnicoSelecionado.telefone}`
                          : "Selecione um técnico (opcional)..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar técnico..." />
                        <CommandList>
                          <CommandEmpty>
                            {loadingTecnicos ? "Carregando..." : "Nenhum técnico encontrado."}
                          </CommandEmpty>
                          <CommandGroup>
                            {/* Opção para limpar seleção */}
                            <CommandItem
                              value="limpar"
                              onSelect={() => {
                                setNovaOrdem((s) => ({ ...s, tecnicoId: "" }))
                                setOpenTecnicoCombo(false)
                              }}
                            >
                              <span className="text-muted-foreground italic">Nenhum técnico</span>
                            </CommandItem>
                            {tecnicos.map((tecnico) => (
                              <CommandItem
                                key={tecnico.id}
                                value={`${tecnico.nome} ${tecnico.telefone}`}
                                onSelect={() => {
                                  setNovaOrdem((s) => ({ ...s, tecnicoId: String(tecnico.id) }))
                                  setOpenTecnicoCombo(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    String(tecnico.id) === novaOrdem.tecnicoId ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium">{tecnico.nome}</span>
                                  <span className="text-xs text-muted-foreground">{tecnico.telefone}</span>
                                  {tecnico.especialidades?.length > 0 && (
                                    <span className="text-xs text-muted-foreground">
                                      {tecnico.especialidades.slice(0, 3).join(", ")}
                                    </span>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Equipamento ID</label>
                  <Input
                    placeholder="ID do equipamento (opcional)"
                    value={novaOrdem.equipamentoId}
                    onChange={(e) => setNovaOrdem((s) => ({ ...s, equipamentoId: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Serviço *</label>
                  <Select
                    value={novaOrdem.tipoServico}
                    onValueChange={(v) => setNovaOrdem((s) => ({ ...s, tipoServico: v as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                      <SelectItem value="reparo">Reparo</SelectItem>
                      <SelectItem value="instalacao">Instalação</SelectItem>
                      <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Prioridade *</label>
                  <Select
                    value={novaOrdem.prioridade}
                    onValueChange={(v) => setNovaOrdem((s) => ({ ...s, prioridade: v as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data de Vencimento</label>
                  <Input
                    type="date"
                    value={novaOrdem.dataVencimento}
                    onChange={(e) => setNovaOrdem((s) => ({ ...s, dataVencimento: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Custo Estimado</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={novaOrdem.custoEstimado}
                    onChange={(e) => setNovaOrdem((s) => ({ ...s, custoEstimado: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição *</label>
                <Textarea
                  placeholder="Descreva o serviço a ser realizado..."
                  rows={3}
                  value={novaOrdem.descricao}
                  onChange={(e) => setNovaOrdem((s) => ({ ...s, descricao: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notas</label>
                <Textarea
                  placeholder="Notas adicionais..."
                  rows={2}
                  value={novaOrdem.notas}
                  onChange={(e) => setNovaOrdem((s) => ({ ...s, notas: e.target.value }))}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleAddOrdem}
                disabled={saving || !novaOrdem.clienteId.trim() || !novaOrdem.descricao.trim()}
              >
                {saving ? "Criando..." : "Criar Ordem"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número ou descrição..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_progresso">Em Progresso</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroPrioridade} onValueChange={setFiltroPrioridade}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Prioridades</SelectItem>
                <SelectItem value="critica">Crítica</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total: {ordensFiltradas.length} ordens</CardTitle>
        </CardHeader>
        <CardContent>
          {ordensFiltradas.length === 0 ? (
            <NaoEncontrado
              titulo="Nenhuma ordem encontrada"
              descricao="Ajuste seus filtros de busca e tente novamente."
              acao={{
                texto: "Limpar Filtros",
                onClick: () => {
                  setBusca("")
                  setFiltroStatus("todos")
                  setFiltroPrioridade("todos")
                },
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordensFiltradas.map((ordem) => (
                    <TableRow key={ordem.id}>
                      <TableCell className="font-mono font-bold text-primary">{ordem.numeroOrdem}</TableCell>
                      <TableCell className="max-w-xs truncate">{ordem.descricao}</TableCell>
                      <TableCell>
                        <Badge className={getBadgeStatus(ordem.status)}>{ordem.status.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getBadgePrioridade(ordem.prioridade)}>{ordem.prioridade}</Badge>
                      </TableCell>
                      <TableCell>{ordem.clienteId}</TableCell>
                      <TableCell>
                        {ordem.dataVencimento ? new Date(ordem.dataVencimento).toLocaleDateString("pt-BR") : "-"}
                      </TableCell>
                      <TableCell>
                        <Link href={`/ordens/${ordem.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
