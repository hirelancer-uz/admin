export const actions = {
  async getCountries({}, payload) {
    const res = await this.$axiosInstance.$get(`/api/countries`, {
      params: payload,
    });
    return res;
  },
  async getAllCountries() {
    const res = await this.$axiosInstance.$get(`/api/countries/all`);
    return res;
  },
  async getCountriesById({}, id) {
    const res = await this.$axiosInstance.$get(`/api/countries/${id}`);
    return res;
  },
  async postCountries({}, data) {
    const res = await this.$axiosInstance.$post(`/api/countries`, data);
    return res;
  },
  async editCountries({}, payload) {
    const res = await this.$axiosInstance.$post(
      `/api/countries/${payload.id}`,
      payload.data
    );
    return res;
  },
  async deleteCountries({}, id) {
    const res = await this.$axiosInstance.$delete(`/api/countries/${id}`);
    return res;
  },
};
