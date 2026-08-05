import axios from "axios";

// Dynamically determine backend URL based on window.location.hostname
// This allows mobile devices on local Wi-Fi, local dev, or production to connect properly
export const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const hostname = typeof window !== "undefined" && window.location.hostname ? window.location.hostname : "localhost";
  return `http://${hostname}:5000`;
};

export const API_URL = getApiUrl();

// Configure axios base URL for all relative API calls
axios.defaults.baseURL = API_URL;

export default API_URL;
