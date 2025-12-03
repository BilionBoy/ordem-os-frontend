"use client"

import { useState, useEffect } from "react"
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
import { getTecnicos, createTecnico } from "@/lib/api/tecnicos"
import { Plus, Phone, Edit, Trash2 } from "lucide-react"
import type { Tecnico } from "@/lib/tipos"

export default function ListaTecnicos() {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [novoTecnico, setNovoTecnico] = useState({
    nome: "",
    telefone: "",
    especialidades: [] as string[],
    especialidadeInput: "",
  })

  useEffect(() => {
    async function fetchTecnicos() {
      try {
        setLoading(true)
        const data = await getTecnicos()
        setTecnicos(data)
      } catch (err) {
        setError("Erro ao carregar técnicos")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTecnicos()
  }, [])

  const handleAddEspecialidade = () => {
    if (novoTecnico.especialidadeInput.trim()) {
      setNovoTecnico((s) => ({
        ...s,
        especialidades: [...s.especialidades, s.especialidadeInput.trim()],
        especialidadeInput: "",
      }))
    }
  }

  const handleRemoveEspecialidade = (idx: number) => {
    setNovoTecnico((s) => ({
      ...s,
      especialidades: s.especialidades.filter((_, i) => i !== idx),
    }))
  }

  const resetNovoTecnico = () =>
    setNovoTecnico({
      nome: "",
      telefone: "",
      especialidades: [],
      especialidadeInput: "",
    })

  const handleAddTecnico = async () => {
    try {
      setSaving(true)
      const criado = await createTecnico({
        nome: novoTecnico.nome.trim(),
        telefone: novoTecnico.telefone.trim(),
        especialidades: novoTecnico.especialidades,
      })
      setTecnicos((prev) => [criado, ...prev])
      resetNovoTecnico()
      setOpen(false)
    } catch (e) {
      console.error(e)
      setError("Erro ao criar técnico")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Carregando...</div>
  if (error) return <div className="p-6 text-destructive">{error}</div>

  const tecnicosFiltrados = tecnicos.filter(
    (t) =>
      t.nome.toLowerCase().includes(busca.toLowerCase()) ||
      t.telefone.toLowerCase().includes(busca.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Técnicos</h1>
          <p className="text-muted-foreground">Gerencie os técnicos do sistema</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>
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
              <Input
                placeholder="Nome completo"
                value={novoTecnico.nome}
                onChange={(e) => setNovoTecnico((s) => ({ ...s, nome: e.target.value }))}
              />
              <Input
                placeholder="Telefone"
                value={novoTecnico.telefone}
                onChange={(e) => setNovoTecnico((s) => ({ ...s, telefone: e.target.value }))}
              />

              <div className="space-y-2">
                <span className="font-medium">Especialidades</span>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: manutenção"
                    value={novoTecnico.especialidadeInput}
                    onChange={(e) => setNovoTecnico((s) => ({ ...s, especialidadeInput: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && handleAddEspecialidade()}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddEspecialidade}>
                    Adicionar
                  </Button>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {novoTecnico.especialidades.map((esp, idx) => (
                    <Badge key={idx} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveEspecialidade(idx)}>
                      {esp} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleAddTecnico}
                disabled={saving || !novoTecnico.nome.trim() || !novoTecnico.telefone.trim()}
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
                  <TableHead>Telefone</TableHead>
                  <TableHead>Especialidades</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tecnicosFiltrados.map((tecnico) => (
                  <TableRow key={tecnico.id}>
                    <TableCell className="font-medium">{tecnico.nome}</TableCell>
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
