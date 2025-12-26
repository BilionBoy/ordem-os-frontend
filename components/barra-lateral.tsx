"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Kanban, List, Users, Settings, X, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BarraLateralProps {
  estaAberta: boolean
  aoFechar: () => void
}

export function BarraLateral({ estaAberta, aoFechar }: BarraLateralProps) {
  const pathname = usePathname()

  const menus = [
    { href: "/", label: "Painel", icon: Home },
    { href: "/kanban", label: "Quadro Kanban", icon: Kanban },
    { href: "/ordens", label: "Ordens de Serviço", icon: List },
    { href: "/tecnicos", label: "Técnicos", icon: Users },
    { href: "/clientes", label: "Clientes", icon: Users },
    { href: "/servicos", label: "Serviços", icon: Wrench },
    { href: "/configuracoes", label: "Configurações", icon: Settings },
  ]

  const isAtivo = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Overlay para mobile */}
      {estaAberta && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={aoFechar} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-primary text-primary-foreground transition-all duration-300 z-40 lg:relative lg:z-0 lg:translate-x-0 flex flex-col",
          estaAberta ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 border-b border-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
              <span className="font-bold text-primary text-sm">OS</span>
            </div>
            <span className="font-bold text-lg">OSControl</span>
          </div>
          <Button variant="ghost" size="icon" onClick={aoFechar} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menus.map((menu) => {
            const Icon = menu.icon
            const ativo = isAtivo(menu.href)
            return (
              <Link key={menu.href} href={menu.href}>
                <button
                  onClick={aoFechar}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-left",
                    ativo
                      ? "bg-primary-foreground text-primary font-semibold"
                      : "hover:bg-primary/80 text-primary-foreground/90",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{menu.label}</span>
                </button>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-primary/20">
          <p className="text-xs text-primary-foreground/70">v1.0.0</p>
        </div>
      </div>
    </>
  )
}
