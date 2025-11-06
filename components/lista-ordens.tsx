"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { OrdemServico } from "@/lib/tipos"
import { ordensServico } from "@/lib/dados-mockados"
import { Search, Eye } from "lucide-react"
import { NaoEncontrado } from "./nao-encontrado"

export default function ListaOrdens() {
  const [ordens] = useState<OrdemServico[]>(ordensServico)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroPrioridade, setFiltroPrioridade] = useState("todos")

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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Ordens de Serviço</h1>
        <p className="text-muted-foreground">Visualize e gerencie todas as suas ordens</p>
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
