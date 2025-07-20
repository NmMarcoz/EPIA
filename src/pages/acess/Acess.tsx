"use client"

import type React from "react"
import type { AccessProps } from "./AccessModel"
import { useAccessViewModel } from "./AccessViewModel"
import AccessView from "./AccessView"

const Access: React.FC<AccessProps> = ({ onLoginSuccess, handleWorker }) => {
  const viewModel = useAccessViewModel({ onLoginSuccess, handleWorker })

  return <AccessView {...viewModel} />
}

export default Access
