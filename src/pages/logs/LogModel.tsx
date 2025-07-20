import type { Log } from "../../utils/types/EpiaTypes"

export interface LogViewProps {
 logs: FormattedLog[]  // Mudança aqui
 isLoading: boolean
 hasError: boolean
 onRetry: () => void
 logStats: {           // Adicionar isso
   total: number
   correct: number
   incorrect: number
   successRate: number
 }
}

export interface FormattedLog extends Log {
 formattedDate: string
 formattedTime: string
 statusText: string
 statusColor: string
 rowBackgroundColor: string
}