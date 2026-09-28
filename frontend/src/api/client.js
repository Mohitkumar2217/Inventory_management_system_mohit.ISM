import axios from "axios";

const apiBaseUrl = `${(import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "")}/api`;
let accessToken = null;
let refreshPromise = null;
let onSessionExpired = () => {};
let onSessionRefreshed = () => {};

export const setAccessToken = token => {
  accessToken = token;
};

export const setSessionExpiredHandler = handler => {
  onSessionExpired = handler;
};

export const setSessionRefreshedHandler = handler => {
  onSessionRefreshed = handler;
};

export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axios.post(`${apiBaseUrl}/auth/refresh`, {}, {
      withCredentials: true,
      headers: { "X-IMS-Client": "web" }
    })
      .then(({ data }) => {
        setAccessToken(data.accessToken);
        onSessionRefreshed(data);
        return data;
      })
      .catch(error => {
        setAccessToken(null);
        onSessionExpired();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

const apiClient = axios.create({ baseURL: apiBaseUrl, withCredentials: true });

apiClient.interceptors.request.use(config => {
  config.headers["X-IMS-Client"] = "web";
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(response => response, async error => {
  const request = error.config;
  if (error.response?.status !== 401 || !request || request._retry || request.url?.startsWith("/auth/")) {
    return Promise.reject(error);
  }

  request._retry = true;
  try {
    await refreshAccessToken();
    request.headers.Authorization = `Bearer ${accessToken}`;
    return apiClient(request);
  } catch {
    return Promise.reject(error);
  }
});

export default apiClient;