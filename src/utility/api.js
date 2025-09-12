// api.js
import axios from "axios";
import { userLogout } from "../context/Actions/AuthActions";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL, 
});

export const setupInterceptors = (dispatch) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        // Show a warning alert
        alert("Your session has expired. Please login again.");

        try {
          // Logout the user after showing the alert
          await userLogout(dispatch);
        } catch (err) {
          console.error("Logout failed:", err);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default api;
