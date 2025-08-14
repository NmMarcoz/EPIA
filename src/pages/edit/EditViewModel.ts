// viewmodels/useSectorEditorViewModel.ts
import { useState, useEffect, useCallback } from "react";
import SectorService from "./EditModel";
import { Sector } from "../../utils/types/EpiaTypes";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export const useSectorEditorViewModel = () => {
  const { sectorId } = useParams();
  const navigate = useNavigate();
  const [sector, setSector] = useState<Sector | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega setor
  const loadSector = useCallback(async () => {
    try {
      setLoading(true);
      const data = await SectorService.getSector(String(sectorId));
      setSector(data);
    } catch (err) {
      setError("Falha ao carregar setor");
      toast.error("Erro ao carregar dados do setor");
    } finally {
      setLoading(false);
    }
  }, [sectorId]);

  useEffect(() => {
    loadSector();
  }, [loadSector]);

  // Manipulação de estado
  const updateField = useCallback((field: keyof Sector, value: string | string[]) => {
    setSector(prev => prev ? { ...prev, [field]: value } : null);
  }, []);

  const updateRule = useCallback((index: number, value: string) => {
    setSector(prev => {
      if (!prev) return null;
      const newRules = [...prev.rules];
      newRules[index] = value;
      return { ...prev, rules: newRules };
    });
  }, []);

  const addRule = useCallback(() => {
    setSector(prev => prev ? { ...prev, rules: [...prev.rules, ""] } : null);
  }, []);

  const removeRule = useCallback((index: number) => {
    setSector(prev => {
      if (!prev) return null;
      return { ...prev, rules: prev.rules.filter((_, i) => i !== index) };
    });
  }, []);

  // Salvar alterações
  const saveChanges = useCallback(async () => {
    if (!sector) return;
    
    try {
      await SectorService.updateSector(sector.code, {
        name: sector.name,
        rules: sector.rules
      });
      toast.success("Setor atualizado com sucesso!");
      navigate("/sectors");
    } catch (err) {
      toast.error("Erro ao salvar alterações");
      console.error("Erro na atualização:", err);
    }
  }, [sector, navigate]);

  return {
    state: { sector, loading, error },
    operations: {
      updateField,
      updateRule,
      addRule,
      removeRule,
      saveChanges
    }
  };
};