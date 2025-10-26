import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // seu backend Spring Boot
});

export default api;
