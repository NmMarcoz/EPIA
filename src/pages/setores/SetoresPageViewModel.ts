// viewmodels/useSectorsViewModel.ts
import { useState, useEffect } from "react";
import { SectorModel } from "./SetoresPageModel";
import { toast } from "sonner";
import { Sector } from "../../utils/types/EpiaTypes";

export const useSectorsViewModel = () => {
  const [state, setState] = useState<{
    sectors: Sector[];
    isLoading: boolean;
    error: string | null;
  }>({
    sectors: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const loadSectors = async () => {
      try {
        const sectorsData = await SectorModel.fetchSectors();
        setState({
          sectors: sectorsData,
          isLoading: false,
          error: null
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        toast.error(errorMessage);
        setState({
          sectors: [],
          isLoading: false,
          error: errorMessage
        });
      }
    };

    loadSectors();
  }, []);

  const hasSectors = state.sectors.length > 0;

  return {
    sectors: state.sectors,
    isLoading: state.isLoading,
    error: state.error,
    hasSectors
  };
};