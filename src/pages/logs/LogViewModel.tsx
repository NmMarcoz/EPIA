"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import * as epiaProvider from "../../infra/providers/EpiaServerProvider"
import type { Log } from "../../utils/types/EpiaTypes"
import type { FormattedLog } from "./LogModel"

export const useLogViewModel = () => {
  const [logs, setLogs] = useState<Log[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true)
      setHasError(false)

      const fetchedLogs = await epiaProvider.getLogs()
      setLogs(fetchedLogs || [])
    } catch (error) {
      console.error("Erro ao buscar logs:", error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleRetry = useCallback(() => {
    fetchLogs()
  }, [fetchLogs])

  // Formatar logs para apresentação
  const formattedLogs = useMemo((): FormattedLog[] => {
    return logs.map((log) => ({
      ...log,
      formattedDate: new Date(log.createdAt).toLocaleDateString("pt-BR"),
      formattedTime: log.remotionHour,
      statusText: log.allEpiCorrects ? "Sim" : "Não",
      statusColor: log.allEpiCorrects ? "#2e7d32" : "#c62828",
      rowBackgroundColor: log.allEpiCorrects ? "#e6ffe6" : "#ffe6e6",
    }))
  }, [logs])

  // Estatísticas dos logs
  const logStats = useMemo(() => {
    const total = logs.length
    const correct = logs.filter((log) => log.allEpiCorrects).length
    const incorrect = total - correct
    const successRate = total > 0 ? Math.round((correct / total) * 100) : 0

    return {
      total,
      correct,
      incorrect,
      successRate,
    }
  }, [logs])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return {
    logs: formattedLogs,
    isLoading,
    hasError,
    logStats,
    onRetry: handleRetry,
  }
}
