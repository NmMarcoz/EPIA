"use client"

import type React from "react"
import type { SetoresProps } from "./SetoresModel"
import { useSetoresViewModel } from "./SetoresViewModel"
import SetoresView from "./SetoresView"

export const Setores: React.FC<SetoresProps> = ({ handleSectorClick }) => {
  const viewModel = useSetoresViewModel({ handleSectorClick })

  return <SetoresView {...viewModel} />
}
