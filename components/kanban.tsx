"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { OrdemServico, StatusOrdem } from "@/lib/tipos"
import { ordensServico } from "@/lib/dados-mockados"
import { Plus } from "lucide-react"

const colunas: { titulo: string; status: StatusOrdem; cor: string }[] = [
  { titulo: "Pendente", status: "pendente", cor: "bg-yellow-100 dark:bg-yellow-950" },
  { titulo: "Em Progresso", status: "em_progresso", cor: "bg-blue-100 dark:bg-blue-950" },
  { titulo: "Concluído", status: "concluido", cor: "bg-green-100 dark:bg-green-950" },
  { titulo: "Cancelado", status: "cancelado", cor: "bg-red-100 dark:bg-red-950" },
]

export default function Kanban() {
  const [ordens] = useState<OrdemServico[]>(ordensServico)

  const getPriorityColor = (prioridade: string) => {
    const cores: { [key: string]: string } = {
      critica: "bg-red-500 text-white",
      alta: "bg-orange-500 text-white",
      media: "bg-yellow-500 text-white",
      baixa: "bg-blue-500 text-white",
    }
    return cores[prioridade] || "bg-gray-500 text-white"
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Quadro de Ordens</h1>
        <p className="text-muted-foreground">Gerencie suas ordens de serviço visualmente</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-max">
        {colunas.map((coluna) => {
          const ordensColuna = ordens.filter((o) => o.status === coluna.status)
          return (
            <div key={coluna.status} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">{coluna.titulo}</h2>
                <Badge variant="secondary">{ordensColuna.length}</Badge>
              </div>

              <div className={`rounded-lg p-4 min-h-[400px] ${coluna.cor}`}>
                <div className="space-y-3">
                  {ordensColuna.map((ordem) => (
                    <Link key={ordem.id} href={`/ordens/${ordem.id}`}>
                      <Card className="cursor-move hover:shadow-md transition-shadow hover:bg-primary/5">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-mono text-sm font-bold text-primary">{ordem.numeroOrdem}</span>
                            <Badge className={getPriorityColor(ordem.prioridade)}>{ordem.prioridade}</Badge>
                          </div>
                          <p className="text-sm font-medium mb-2 line-clamp-2">{ordem.descricao}</p>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>Cliente: {ordem.clienteId}</p>
                            <p>Tipo: {ordem.tipoServico}</p>
                            {ordem.dataVencimento && (
                              <p>Vence: {new Date(ordem.dataVencimento).toLocaleDateString("pt-BR")}</p>
                            )}
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            {ordem.tarefas && (
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{
                                    width: `${(ordem.tarefas.filter((t) => t.status === "concluida").length / ordem.tarefas.length) * 100}%`,
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-4 border-dashed bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Ordem
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
