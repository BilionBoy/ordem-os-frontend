"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import type { Tecnico } from "@/lib/tipos"
import { tenicosMock } from "@/lib/dados-mockados"
import { Plus, Edit, Trash2, Phone, Mail } from "lucide-react"

export default function ListaTecnicos() {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>(tenicosMock)
  const [busca, setBusca] = useState("")

  const tecnicosFiltrados = tecnicos.filter(
    (t) => t.nome.toLowerCase().includes(busca.toLowerCase()) || t.email.toLowerCase().includes(busca.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    const cores: { [key: string]: string } = {
      disponivel: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
      ocupado: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
      ausente: "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200",
    }
    return cores[status] || ""
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Técnicos</h1>
          <p className="text-muted-foreground">Gerencie os técnicos do sistema</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Técnico
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Técnico</DialogTitle>
              <DialogDescription>Preencha os dados do novo técnico</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Nome completo" />
              <Input placeholder="Email" type="email" />
              <Input placeholder="Telefone" />
              <Button className="w-full">Adicionar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtrar</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Buscar por nome ou email..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total: {tecnicosFiltrados.length} técnicos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Especialidades</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tecnicosFiltrados.map((tecnico) => (
                  <TableRow key={tecnico.id}>
                    <TableCell className="font-medium">{tecnico.nome}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {tecnico.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {tecnico.telefone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {tecnico.especialidades.map((esp, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {esp}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(tecnico.statusDisponibilidade)}>
                        {tecnico.statusDisponibilidade}
                      </Badge>
                    </TableCell>
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
