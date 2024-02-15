export const actions = {
  async getFaqs({}, payload) {
    const res = await this.$axiosInstance.$get(`/faqs`, {
      params: payload,
    });
    return res;
  },
  async getFaqsCategories({}, payload) {
    const res = await this.$axiosInstance.$get(`/faq_categories`, {
      params: payload,
    });
    return res;
  },
  async getFaqsCategoriesAll({}, payload) {
    const res = await this.$axiosInstance.$get(`/faq_categories/all`);
    return res;
  },
  async getFaqsById({}, id) {
    const res = await this.$axiosInstance.$get(`/faqs/${id}`);
    return res;
  },
  async getFaqsCategoriesById({}, id) {
    const res = await this.$axiosInstance.$get(`/faq_categories/${id}`);
    return res;
  },
  async postFaqsCategories({}, data) {
    const res = await this.$axiosInstance.$post(`/faq_categories`, data);
    return res;
  },
  async postFaqs({}, data) {
    const res = await this.$axiosInstance.$post(`/faqs`, data);
    return res;
  },
  async editFaqsCategories({}, payload) {
    const res = await this.$axiosInstance.$put(
      `/faq_categories/${payload.id}`,
      payload.data
    );
    return res;
  },
  async editFaqs({}, payload) {
    const res = await this.$axiosInstance.$put(
      `/faqs/${payload.id}`,
      payload.data
    );
    return res;
  },
  async deleteFaqs({}, id) {
    const res = await this.$axiosInstance.$delete(`/faqs/${id}`);
    return res;
  },
  async deleteFaqsCategories({}, id) {
    const res = await this.$axiosInstance.$delete(`/faq_categories/${id}`);
    return res;
  },
};
