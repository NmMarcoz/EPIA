"use client"

import type React from "react"
import type { HomeProps } from "./HomeModel"
import { useHomeViewModel } from "./HomeViewModel"
import HomeView from "./HomeView"

export const Homepage: React.FC<HomeProps> = ({ worker, sector }) => {
  const viewModel = useHomeViewModel({ worker, sector })

  return <HomeView {...viewModel} />
}
