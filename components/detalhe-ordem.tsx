"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Edit, Trash2, Plus, Clock, CheckCircle } from "lucide-react"
import type { Tarefa } from "@/lib/tipos"
import { tenicosMock, clientesMock } from "@/lib/dados-mockados"
import { getOrdemServicoById } from "@/lib/api/ordem_servicos"

interface DetalheOrdemProps {
  ordemId: string
}

export default function DetalheOrdem({ ordemId }: DetalheOrdemProps) {
  const router = useRouter()

  const [ordem, setOrdem] = useState<any>(null)
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [novaDescricao, setNovaDescricao] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrdem() {
      setLoading(true)
      setError(null)
      try {
        const data = await getOrdemServicoById(ordemId)
        setOrdem(data)
        setTarefas(data.tarefas || [])
      } catch (err: any) {
        setError(err.message || "Erro ao buscar ordem de serviço")
      } finally {
        setLoading(false)
      }
    }
    fetchOrdem()
  }, [ordemId])

  const tecnico = ordem ? tenicosMock.find((t) => t.id === ordem.tecnicoId) : null
  const taxaProgress = tarefas.length > 0 ? (tarefas.filter((t) => t.status === "concluida").length / tarefas.length) * 100 : 0

  const getBadgeStatus = (status: string) => {
    const cores: { [key: string]: string } = {
      pendente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
      em_progresso: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
      concluido: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
      cancelado: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
      nao_iniciada: "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200",
      em_andamento: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
      concluida: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
      bloqueada: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
    }
    return cores[status] || "bg-gray-100 text-gray-800"
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

  const adicionarTarefa = () => {
    if (novaDescricao.trim()) {
      const novaTarefa: Tarefa = {
        id: `tar-${Date.now()}`,
        descricao: novaDescricao,
        status: "nao_iniciada",
      }
      setTarefas([...tarefas, novaTarefa])
      setNovaDescricao("")
    }
  }

  const removerTarefa = (tarefaId: string) => {
    setTarefas(tarefas.filter((t) => t.id !== tarefaId))
  }

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }
  if (!ordem) {
    return <div className="p-6">Ordem de serviço não encontrada.</div>
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">OS Número: {ordem.id}</h1>
        </div>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal - informações e tarefas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações gerais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={getBadgeStatus(ordem.status_descricao)}>{ordem.status_descricao}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Prioridade</label>
                  <div className="mt-1">
                    <Badge className={getBadgePrioridade(ordem.prioridade_descricao)}>{ordem.prioridade_descricao}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Tipo de Serviço</label>
                  <p className="font-medium mt-1">{ordem.tipoServico}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Data de Agendamento</label>
                  <p className="font-medium mt-1">{new Date(ordem.data_agendamento).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>

              {/* Datas importantes */}
              <div className="border-t pt-4 space-y-2">
                {ordem.data_vencimento && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">
                      Vencimento: <strong>{new Date(ordem.data_vencimento).toLocaleDateString("pt-BR")}</strong>
                    </span>
                  </div>
                )}
                {ordem.dataFechamento && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Concluído em: <strong>{new Date(ordem.dataFechamento).toLocaleDateString("pt-BR")}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Custos */}
              {(ordem.custoEstimado || ordem.custoReal) && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Custo Estimado:</span>
                    <span className="font-medium">R$ {ordem.custoEstimado?.toFixed(2) || "-"}</span>
                  </div>
                  {ordem.custoReal && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Custo Real:</span>
                      <span className="font-medium">R$ {ordem.custoReal.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Notas */}
              {ordem.notas && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Notas:</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{ordem.notas}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Serviços */}
          <Card>
            <CardHeader>
              <CardTitle>Serviços</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ordem.servicos && ordem.servicos.length > 0 ? (
                <ul className="space-y-2">
                  {ordem.servicos.map((servico: any) => (
                    <li key={servico.id} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                      <span className="font-medium">{servico.nome}</span>
                      <span className="text-sm text-muted-foreground">R$ {Number(servico.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum serviço relacionado.</p>
              )}
            </CardContent>
          </Card>

          {/* Equipamentos */}
          <Card>
            <CardHeader>
              <CardTitle>Equipamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ordem.equipamentos && ordem.equipamentos.length > 0 ? (
                <ul className="space-y-2">
                  {ordem.equipamentos.map((equip: any) => (
                    <li key={equip.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                      <div className="font-medium">{equip.marca} ({equip.btus} BTUs)</div>
                      <div className="text-sm text-muted-foreground">Local: {equip.local_instalacao}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum equipamento relacionado.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral - informações de contato */}
        <div className="space-y-6">
          {/* Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{ordem.cliente?.nome || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{ordem.cliente?.telefones.find(() => true)?.numero || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Endereço</p>
               <p className="font-medium text-sm">
                  {ordem.cliente?.enderecos?.[0]
                    ? `${ordem.cliente.enderecos[0].rua}, ${ordem.cliente.enderecos[0].numero} - ${ordem.cliente.enderecos[0].bairro}`
                    : "-"}
                </p>

              </div>
              <Button className="w-full mt-4">Contatar Cliente</Button>
            </CardContent>
          </Card>

          {/* Técnico */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Técnico Responsável</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ordem.tecnico_responsavel ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{ordem.tecnico_responsavel.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{ordem.tecnico_responsavel.telefone}</p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum técnico atribuído</p>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Ordem aberta</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ordem.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                {ordem.dataFechamento && (
                  <div className="flex gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Ordem concluída</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(ordem.dataFechamento).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
