import axios from "axios";


const api = axios.create({
  baseURL: "http://192.168.0.5:4000/api",
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // 🔹 El token expiró
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      // Al borrar, AuthContext detecta user=null y AppNavigator te manda al Login
    }
    return Promise.reject(error);
  }
);


export default api;
