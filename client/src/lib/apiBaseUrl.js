const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const fromEnv = import.meta.env.VITE_BACKEND_URL;

let runtimeBase = "";
if (fromEnv) {
  runtimeBase = trimTrailingSlash(fromEnv);
} else if (import.meta.env.DEV) {
  runtimeBase = "http://localhost:8080";
} else if (typeof window !== "undefined") {
  runtimeBase = trimTrailingSlash(window.location.origin);
}

export const API_BASE_URL = runtimeBase;
