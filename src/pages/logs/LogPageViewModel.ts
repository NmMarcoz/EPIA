// viewmodels/useLogsViewModel.ts
import { useState, useEffect, useCallback } from "react";
import { LogService } from "./LogPageModel";
import { Log } from "../../utils/types/EpiaTypes";

export const useLogsViewModel = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;
 






  const totalPages = Math.ceil(logs.length / logsPerPage);
  const paginatedLogs = logs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const logsData = await LogService.getLogs();
      setLogs(logsData);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  return {
    state: {
      logs: paginatedLogs,
      isLoading,
      currentPage,
      totalPages,
      hasLogs: logs.length > 0
    },
    handlers: {
      goToNextPage,
      goToPrevPage
    }
  };
  
};

// Função auxiliar para extrair horas (pode ser movida para utils)
// export const extractHourFromDateIso = (dateString: string) => {
//   const date = new Date(dateString);
//   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// };