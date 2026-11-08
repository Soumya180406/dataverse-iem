import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

export const useLeaderboard = (intervalMs = 5000) => {
  const [data, setData] = useState({ games: [], items: [], total: 0, updated_at: null });
  const [loaded, setLoaded] = useState(false);
  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/leaderboard");
      setData(data);
    } catch {
      // keep last good data on a failed poll
    } finally {
      setLoaded(true);
    }
  }, []);
  useEffect(() => {
    refresh();
    const id = setInterval(() => { if (!document.hidden) refresh(); }, intervalMs);
    return () => clearInterval(id);
  }, [refresh, intervalMs]);
  return { ...data, loaded, refresh };
};
