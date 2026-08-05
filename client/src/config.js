import axios from "axios";

// Dynamically determine backend URL based on window.location
export const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== "undefined" && window.location.hostname) {
    const { hostname, protocol, origin } = window.location;

    // Local dev or local network Wi-Fi access (mobile testing)
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.")
    ) {
      return `${protocol}//${hostname}:5000`;
    }

    // Production environment (Vercel / Netlify / HTTPS domain)
    return origin;
  }

  return "http://localhost:5000";
};

export const API_URL = getApiUrl();

// Configure axios base URL for all relative API calls
axios.defaults.baseURL = API_URL;

export default API_URL;
