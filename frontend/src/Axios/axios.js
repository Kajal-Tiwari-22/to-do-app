import axios from "axios";

// ✅ Use correct production URL with /api and fallback to localhost
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://to-do-app-jloe.onrender.com/api"
});

export default instance;

