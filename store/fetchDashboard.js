export const actions = {

  async getDashboard({}, data) {
    return await this.$axiosInstance.$get(`/api/admin/dashboard`, data);
  },
};
