import type { Sector } from "../../utils/types/EpiaTypes"

export interface EditProps {
  sector: Sector
  onSectorUpdate?: (updatedSector: Sector) => void
}

export interface EditViewProps {
  sectorData: Sector
  isLoading: boolean
  onInputChange: (field: keyof Sector, value: string | string[]) => void
  onRequirementChange: (index: number, value: string) => void
  onAddRequirement: () => void
  onRemoveRequirement: (index: number) => void
  onSaveChanges: () => void
}

export interface EditViewModelProps {
  sector: Sector
  onSectorUpdate?: (updatedSector: Sector) => void
}
