import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Don't try to refresh when the failed request was the refresh endpoint
    if (originalRequest.url === "/auth/refresh") {
      return Promise.reject(error);
    }

    // Sirf 401
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Already retried
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        return axiosInstance(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      console.log("🔄 Trying refresh token...");

      await axiosInstance.post("/auth/refresh");

      console.log("✅ New access token generated");

      processQueue(null);

      return axiosInstance(originalRequest);

    } catch (refreshError) {
      console.log("❌ Refresh token invalid/expired");

      processQueue(refreshError);

      // Redirect to login when refresh fails, but only if we're not already there
      try {
        const currentPath = window.location && window.location.pathname;
        if (currentPath !== "/login") {
          window.location.href = "/login";
        }
      } catch (navErr) {
        // ignore navigation errors in non-browser environments
      }

      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;