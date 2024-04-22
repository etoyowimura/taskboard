import axios from "axios";

const instance = axios.create({
  baseURL: "http://10.10.10.45:8080/api/v1/",
});
// const instance = axios.create({
//   baseURL: "https://api.tteld.co/api/v1/",
// });

const token: string | null = localStorage.getItem("access");
if (token) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default instance;
