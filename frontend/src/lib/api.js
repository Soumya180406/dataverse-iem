import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const errMsg = (e, fallback = "Something went wrong") => {
  const d = e?.response?.data?.detail;
  if (Array.isArray(d)) {
    return d.map((x) => `${x.loc?.[x.loc.length - 1] ?? ""}: ${x.msg}`.replace(/^: /, "").replace("Value error, ", "")).join(" • ");
  }
  return d || fallback;
};

export const EVENT_START = new Date("2027-02-13T09:00:00+05:30");
