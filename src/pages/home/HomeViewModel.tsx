"use client"

import { useMemo } from "react"
import type {HomeProps} from "./HomeModel"

export const useHomeViewModel = ({ worker, sector }: HomeProps) => {
  // Lógica para calcular taxa de esquecimento (pode ser expandida futuramente)
  const forgetfulnessRate = useMemo(() => {
    // Por enquanto é um valor fixo, mas pode ser calculado baseado nos dados do worker
    return "12%"
  }, [worker])

  // Função para formatar dados do setor
  const getSectorCode = useMemo(() => {
    return sector?.code ?? "carregando"
  }, [sector])

  const getSectorName = useMemo(() => {
    return sector?.name ?? "carregando"
  }, [sector])

  // Função para formatar dados do trabalhador
  const getWorkerName = useMemo(() => {
    return worker?.name || "carregando"
  }, [worker])

  const getWorkerFunction = useMemo(() => {
    return worker?.function || "carregando"
  }, [worker])

  // Função para processar regras do setor
  const getSectorRules = useMemo(() => {
    return sector?.rules || []
  }, [sector])

  return {
    worker,
    sector,
    forgetfulnessRate,
    sectorCode: getSectorCode,
    sectorName: getSectorName,
    workerName: getWorkerName,
    workerFunction: getWorkerFunction,
    sectorRules: getSectorRules,
  }
}
