"use client"

import { useState } from "react"
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
import { ordensServico, tenicosMock, clientesMock } from "@/lib/dados-mockados"

interface DetalheOrdemProps {
  ordemId: string
}

export default function DetalheOrdem({ ordemId }: DetalheOrdemProps) {
  const router = useRouter()
  const ordem = ordensServico.find((o) => o.id === ordemId) || ordensServico[0]
  const [tarefas, setTarefas] = useState<Tarefa[]>(ordem.tarefas)
  const [novaDescricao, setNovaDescricao] = useState("")

  const cliente = clientesMock.find((c) => c.id === ordem.clienteId)
  const tecnico = tenicosMock.find((t) => t.id === ordem.tecnicoId)

  const taxaProgress = (tarefas.filter((t) => t.status === "concluida").length / tarefas.length) * 100

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

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{ordem.numeroOrdem}</h1>
          <p className="text-muted-foreground">{ordem.descricao}</p>
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
                    <Badge className={getBadgeStatus(ordem.status)}>{ordem.status.replace("_", " ")}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Prioridade</label>
                  <div className="mt-1">
                    <Badge className={getBadgePrioridade(ordem.prioridade)}>{ordem.prioridade}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Tipo de Serviço</label>
                  <p className="font-medium mt-1">{ordem.tipoServico}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Data de Abertura</label>
                  <p className="font-medium mt-1">{new Date(ordem.dataAbertura).toLocaleDateString("pt-BR")}</p>
                </div>
              </div>

              {/* Datas importantes */}
              <div className="border-t pt-4 space-y-2">
                {ordem.dataVencimento && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">
                      Vencimento: <strong>{new Date(ordem.dataVencimento).toLocaleDateString("pt-BR")}</strong>
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

          {/* Tarefas */}
          <Card>
            <CardHeader>
              <CardTitle>Tarefas e Atividades</CardTitle>
              <CardDescription>Progresso: {Math.round(taxaProgress)}%</CardDescription>
              <Progress value={taxaProgress} className="mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {tarefas.map((tarefa) => (
                <div key={tarefa.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium">{tarefa.descricao}</p>
                      {tarefa.tecnicoAssignado && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Atribuído a: {tenicosMock.find((t) => t.id === tarefa.tecnicoAssignado)?.nome || "-"}
                        </p>
                      )}
                      {tarefa.dataInicio && (
                        <p className="text-sm text-muted-foreground">
                          Iniciado em: {new Date(tarefa.dataInicio).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getBadgeStatus(tarefa.status)}>{tarefa.status.replace("_", " ")}</Badge>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogTitle>Remover tarefa?</AlertDialogTitle>
                          <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
                          <div className="flex gap-4 justify-end">
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removerTarefa(tarefa.id)}>Remover</AlertDialogAction>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}

              {/* Adicionar nova tarefa */}
              <div className="border-t pt-4 space-y-2">
                <label className="text-sm font-medium">Nova Tarefa</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Descreva a nova tarefa..."
                    value={novaDescricao}
                    onChange={(e) => setNovaDescricao(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && adicionarTarefa()}
                  />
                  <Button onClick={adicionarTarefa} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>
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
                <p className="font-medium">{cliente?.nome || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-sm break-all">{cliente?.email || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{cliente?.telefone || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p className="font-medium text-sm">{cliente?.endereco || "-"}</p>
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
              {tecnico ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{tecnico.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-sm break-all">{tecnico.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{tecnico.telefone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Especialidades</p>
                    <div className="space-y-1">
                      {tecnico.especialidades.map((esp, idx) => (
                        <Badge key={idx} variant="secondary">
                          {esp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                      className={
                        tecnico.statusDisponibilidade === "disponivel"
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                      }
                    >
                      {tecnico.statusDisponibilidade}
                    </Badge>
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
                      {new Date(ordem.dataAbertura).toLocaleDateString("pt-BR")}
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
