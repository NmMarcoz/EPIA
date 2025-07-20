"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import type { Sector } from "../../utils/types/EpiaTypes"
import * as epiaProvider from "../../infra/providers/EpiaServerProvider"
import type { SetoresViewModelProps } from "./SetoresModel"

export const useSetoresViewModel = ({ handleSectorClick }: SetoresViewModelProps) => {
  const [sectors, setSectors] = useState<Sector[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const fetchSectors = useCallback(async () => {
    try {
      setIsLoading(true)
      setHasError(false)

      const sectorsResponse = await epiaProvider.getSectors()
      setSectors(sectorsResponse || [])
    } catch (err: any) {
      setHasError(true)
      toast.error(err.message || "Erro ao carregar setores")
      console.error("Erro ao buscar setores:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSectorClickWrapper = useCallback(
    (sector: Sector) => {
      handleSectorClick(sector)
    },
    [handleSectorClick],
  )

  const retryFetch = useCallback(() => {
    fetchSectors()
  }, [fetchSectors])

  useEffect(() => {
    fetchSectors()
  }, [fetchSectors])

  return {
    sectors,
    isLoading,
    hasError,
    onSectorClick: handleSectorClickWrapper,
    retryFetch,
  }
}
