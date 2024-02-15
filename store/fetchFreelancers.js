export const actions = {
  async getFreelancers({}, payload) {
    const res = await this.$axiosInstance.$get(
      `/api/admin/freelancers`,
      payload
    );
    return res;
  },
  async postMailing({}, data) {
    const res = await this.$axiosInstance.$post(`/api/mailing`, data);
    return res;
  },
  async getFreelancerById({}, id) {
    const res = await this.$axiosInstance.$get(`/api/admin/freelancers/${id}`);
    return res;
  },
};
