"use client"

import type React from "react"
import type { EditProps } from "./EditModel"
import { useEditViewModel } from "./EditModelView"
import EditView from "./EditView"

const Edit: React.FC<EditProps> = ({ sector, onSectorUpdate }) => {
  const viewModel = useEditViewModel({ sector, onSectorUpdate })

  return <EditView {...viewModel} />
}

export default Edit
