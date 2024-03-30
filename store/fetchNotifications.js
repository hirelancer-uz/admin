export const actions = {
  async getNotifications({}, payload) {
    const res = await this.$axiosInstance.$get(`/api/admin/moderator_messages`, {
      params: payload,
    });
    return res;
  },
  async postNotifications({}, data) {
    const res = await this.$axiosInstance.$post(`/api/admin/moderator_messages`, data);
    return res;
  },
};
