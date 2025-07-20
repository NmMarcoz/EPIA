import type { Sector } from "../../utils/types/EpiaTypes"

export interface SetoresProps {
  handleSectorClick: (sector: Sector) => void
   handleWorker: (worker: any) => void
  onLoginSuccess: () => void
}

export interface SetoresViewProps {
  sectors: Sector[]
  isLoading: boolean
  hasError: boolean
  onSectorClick: (sector: Sector) => void
}

export interface SetoresViewModelProps {
  handleSectorClick: (sector: Sector) => void
}
