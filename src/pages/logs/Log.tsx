"use client"

import type React from "react"
import { useLogViewModel } from "./LogViewModel"
import LogView from "./LogView"

export const Log: React.FC = () => {
  const viewModel = useLogViewModel()

  return <LogView {...viewModel} />
}
