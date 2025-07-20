"use client"

import { useState, useCallback } from "react"
import { invoke } from "@tauri-apps/api/core"
import { toast } from "sonner"
import type { Sector } from "../../utils/types/EpiaTypes"
import type { EditViewModelProps } from "./EditModel"

export const useEditViewModel = ({ sector, onSectorUpdate }: EditViewModelProps) => {
  const [sectorData, setSectorData] = useState<Sector>({ ...sector })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = useCallback((field: keyof Sector, value: string | string[]) => {
    setSectorData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  const handleRequirementChange = useCallback(
    (index: number, value: string) => {
      const newRules = [...sectorData.rules]
      newRules[index] = value
      handleInputChange("rules", newRules)
    },
    [sectorData.rules, handleInputChange],
  )

  const handleAddRequirement = useCallback(() => {
    handleInputChange("rules", [...sectorData.rules, ""])
  }, [sectorData.rules, handleInputChange])

  const handleRemoveRequirement = useCallback(
    (index: number) => {
      const newRules = sectorData.rules.filter((_, i) => i !== index)
      handleInputChange("rules", newRules)
    },
    [sectorData.rules, handleInputChange],
  )

  const handleSaveChanges = useCallback(async () => {
    try {
      setIsLoading(true)

      const updates: Record<string, any> = {
        name: sectorData.name, // Sempre envie o name
        rules: sectorData.rules, // Sempre envie as rules
      }

      const updatedSector = await invoke<Sector>("update_sector", {
        code: sector.code,
        sector: updates,
      })

      toast.success("Setor atualizado com sucesso!")

      if (onSectorUpdate) {
        onSectorUpdate(updatedSector)
      }
    } catch (error) {
      console.error("Erro ao atualizar setor:", error)
      toast.error("Erro ao salvar alterações")
    } finally {
      setIsLoading(false)
    }
  }, [sectorData, sector.code, onSectorUpdate])

  const validateForm = useCallback(() => {
    if (!sectorData.name.trim()) {
      toast.error("Nome do setor é obrigatório")
      return false
    }

    if (sectorData.rules.some((rule) => !rule.trim())) {
      toast.error("Todos os requisitos devem ser preenchidos")
      return false
    }

    return true
  }, [sectorData])

  const handleSaveWithValidation = useCallback(async () => {
    if (validateForm()) {
      await handleSaveChanges()
    }
  }, [validateForm, handleSaveChanges])

  return {
    sectorData,
    isLoading,
    onInputChange: handleInputChange,
    onRequirementChange: handleRequirementChange,
    onAddRequirement: handleAddRequirement,
    onRemoveRequirement: handleRemoveRequirement,
    onSaveChanges: handleSaveWithValidation,
  }
}
