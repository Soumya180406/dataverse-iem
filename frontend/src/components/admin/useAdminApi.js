import { useCallback } from "react";
import { useAuth } from "@clerk/react";
import { toast } from "sonner";
import { api, errMsg } from "@/lib/api";

export const useAdminApi = () => {
  const { getToken } = useAuth();
  return useCallback(async (method, url, opts = {}) => {
    const token = await getToken();
    return api.request({ method, url, ...opts, headers: { ...(opts.headers || {}), Authorization: `Bearer ${token}` } });
  }, [getToken]);
};

export const run = async (fn, ok) => {
  try { const r = await fn(); if (ok) toast.success(ok); return r; }
  catch (e) { toast.error(errMsg(e)); return null; }
};
