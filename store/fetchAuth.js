export const actions = {
  async auth({}, data) {
    const res = await this.$axios.$post(`/api/admin/auth/login`, data);
    return res;
  },
  async logOut({}, data) {
    const res = await this.$axiosInstance.$post(`/api/auth/logout`);
    return res;
  },
};
