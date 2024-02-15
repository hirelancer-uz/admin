export const actions = {
  async getStaticInfo({}, payload) {
    try {
      const res = await this.$axiosInstance.$get(`/site_infos`, {
        params: payload,
      });
      return res;
    } catch (e) {
      return e;
    }
  },
  async postStaticInfo({}, data) {
    const res = await this.$axiosInstance.$post(`/site_infos`, data);
    return res;
  },
};
