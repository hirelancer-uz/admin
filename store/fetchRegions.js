export const actions = {
  async getRegions({}, payload) {
    const res = await this.$axiosInstance.$get(`/api/regions`, {
      params: payload,
    });
    return res;
  },
  async getAllRegions() {
    const res = await this.$axiosInstance.$get(`/api/regions/all`);
    return res;
  },
  async getRegionsById({}, id) {
    const res = await this.$axiosInstance.$get(`/api/regions/${id}`);
    return res;
  },
  async postRegions({}, data) {
    const res = await this.$axiosInstance.$post(`/api/admin/regions`, data);
    return res;
  },
  async editRegions({}, payload) {
    const res = await this.$axiosInstance.$post(
      `/api/admin/regions/${payload.id}`,
      payload.data
    );
    return res;
  },
  async deleteRegions({}, id) {
    const res = await this.$axiosInstance.$delete(`/api/regions/${id}`);
    return res;
  },
};
