"use client"

import type React from "react"
import { useState } from "react"
import { BarraNavegacao } from "@/components/barra-navegacao"
import { BarraLateral } from "@/components/barra-lateral"
import { ProveedorTema } from "@/components/provedor-tema"

export default function LayoutPainel({ children }: { children: React.ReactNode }) {
  const [barraLateralAberta, setBarraLateralAberta] = useState(false)

  return (
    <ProveedorTema>
      <div className="flex h-screen bg-background">
        <BarraLateral estaAberta={barraLateralAberta} aoFechar={() => setBarraLateralAberta(false)} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <BarraNavegacao onMenuToggle={() => setBarraLateralAberta(!barraLateralAberta)} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProveedorTema>
  )
}
