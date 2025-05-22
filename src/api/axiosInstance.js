// axiosInstance.js
import axios from "axios";

// axiosInstance.js
const axiosInstance = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL || "https://ecom.hlinecrm.in/api/",
});

// Example: intercept requests to attach tokens or handle errors globally
axiosInstance.interceptors.request.use(
  (config) => {
    // Attach token or any necessary headers here
    const token = localStorage.getItem("accessToken"); // Or however you're storing the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle any errors in responses (e.g., redirect to login if token expires)
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
