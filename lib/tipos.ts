// Tipos centrais do sistema de Ordem de Serviço

export type StatusOrdem = "pendente" | "em_progresso" | "concluido" | "cancelado"
export type StatusTaref = "nao_iniciada" | "em_andamento" | "concluida" | "bloqueada"
export type TipoServico = "manutencao" | "reparo" | "instalacao" | "diagnostico"

export type Telefone = {
  id: number
  numero: string
  cliente_id: number
  created_at: string
  updated_at: string
}

export type Endereco = {
  id: number
  logradouro: string
  cep: string
  cidade: string
  estado: string
  cliente_id: number
  created_at: string
  updated_at: string
}

export interface Cliente {
  id: number
  nome: string
  email?: string | null
  dataRegistro: string
  telefones: Telefone[]
  enderecos: Endereco[]
}

export interface Tecnico {
  id: string
  nome: string
  email: string
  telefone: string
  especialidades: string[]
  statusDisponibilidade: "disponivel" | "ocupado" | "ausente"
}

export interface Equipamento {
  id: string
  marca: string
  modelo: string
  localInstalacao: string
  capacidade: string
  observacao: string
  clienteId: string
}

export interface Tarefa {
  id: string
  descricao: string
  status: StatusTaref
  tecnicoAssignado?: string
  dataInicio?: string
  dataFim?: string
}

export interface Servico {
  id: string
  nome: string
  valor: number
}

export interface OrdemServico {
  id: string
  numeroOrdem: string
  clienteId: string
  tecnicoId?: string
  equipamentoId?: string
  tipoServico: TipoServico
  descricao: string
  status: StatusOrdem
  prioridade: "baixa" | "media" | "alta" | "critica"
  tarefas: Tarefa[]
  dataAbertura: string
  dataFechamento?: string
  dataVencimento?: string
  notas: string
  custoEstimado?: number
  custoReal?: number
}

export interface Dashboard {
  totalOrdens: number
  ordensAbertos: number
  ordensEmProgresso: number
  ordensConcluidas: number
  taxaConclusao: number
  custoDia: number
  tempoMedioAtencimento: number
}
