// viewmodels/useLogDetailedViewModel.ts
import { useState, useEffect } from "react";
import { LogModel } from "./LogDetailedPageModel";
import { Log } from "../../utils/types/EpiaTypes";

export const useLogDetailedViewModel = (logId?: string) => {
  const [state, setState] = useState<{
    log: Log | null;
    isLoading: boolean;
    error: string | null;
  }>({
    log: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchLog = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        if (logId) {
          const logData = await LogModel.fetchLogById(logId);
          setState({ log: logData, isLoading: false, error: null });
        } else {
          setState({ log: null, isLoading: false, error: "ID do log não fornecido" });
        }
      } catch (error) {
        setState({ 
          log: null, 
          isLoading: false, 
          error: "Falha ao carregar detalhes do log" 
        });
      }
    };

    if (logId) fetchLog();
  }, [logId]);

  // Formatar dados para a view
  const formattedDate = state.log 
    ? new Date(state.log.createdAt).toISOString().slice(0, 10)
    : "";

  return {
    ...state,
    formattedDate,
    hasMissingItems: state.log?.removedEpi && state.log.removedEpi.length > 0,
    hasRules: state.log?.sector.rules && state.log.sector.rules.length > 0
  };
};