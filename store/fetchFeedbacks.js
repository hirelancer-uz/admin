export const actions = {
  async getFeedbacks({}, payload) {
    const res = await this.$axiosInstance.$get(`/feedbacks`, {
      params: payload,
    });
    return res;
  },

  async getFeedbacksById({}, id) {
    const res = await this.$axiosInstance.$get(`/feedbacks/${id}`, {});
    return res;
  },

  async postFeedbacks({}, data) {
    const res = await this.$axiosInstance.$post(`/feedbacks`, data);
    return res;
  },
  async editFeedbacks({}, payload) {
    const res = await this.$axiosInstance.$put(
      `/feedbacks/${payload.id}`,
      payload.data
    );
    return res;
  },
  async deleteFeedbacks({}, id) {
    const res = await this.$axiosInstance.$delete(`/feedbacks/${id}`);
    return res;
  },
};
