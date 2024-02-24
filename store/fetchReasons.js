export const actions = {
  async getReasons({}, payload) {
    const res = await this.$axiosInstance.$get(`/api/admin/cancel_reasons`, {
      params: payload,
    });
    return res;
  },
  async getAllReasons() {
    const res = await this.$axiosInstance.$get(`/api/admin/cancel_reasons/all`);
    return res;
  },
  async getReasonsById({}, id) {
    const res = await this.$axiosInstance.$get(
      `/api/admin/cancel_reasons/${id}`
    );
    return res;
  },
  async postReasons({}, data) {
    const res = await this.$axiosInstance.$post(
      `/api/admin/cancel_reasons`,
      data
    );
    return res;
  },
  async editReasons({}, payload) {
    const res = await this.$axiosInstance.$put(
      `/api/admin/cancel_reasons/${payload.id}`,
      payload.data
    );
    return res;
  },
  async deleteReasons({}, id) {
    const res = await this.$axiosInstance.$delete(
      `/api/admin/cancel_reasons/${id}`
    );
    return res;
  },
};
