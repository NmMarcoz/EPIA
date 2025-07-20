import type { Worker, Sector } from "../../utils/types/EpiaTypes"

export interface HomeProps {
  worker: Worker
  sector: Sector
}

export interface HomeViewProps {
  worker: Worker
  sector: Sector
  forgetfulnessRate: string
}

export interface HomeViewModelProps {
  worker: Worker
  sector: Sector
}
