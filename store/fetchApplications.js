export const actions = {
  async getApplications({}, payload) {
    const res = await this.$axiosInstance.$get(`/api/applications`, {
      params: payload,
    });
    return res;
  },
  async deleteApplications({}, id) {
    const res = await this.$axiosInstance.$delete(
      `/api/applications/${id}`,
      {}
    );
    return res;
  },
};
