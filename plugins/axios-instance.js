export default ({ $axios, redirect, error }, inject) => {
  const axiosInstance = $axios.create({
    baseURL: process.env.BASE_URL || 'https://api.hirelancer.ndc.uz',
  });
  // axiosInstance.setHeader("Content-Type", "application/json");

  axiosInstance.onRequest((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  axiosInstance.onResponse((response) => {
    return response;
  });

  axiosInstance.onError(async (e) => {
    return Promise.reject(e);
  });
  inject("axiosInstance", axiosInstance);
};
