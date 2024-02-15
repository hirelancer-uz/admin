export const actions = {
  async getOrders({}, payload) {
    const res = await this.$axiosInstance.$get(`/api/admin/orders`, {
      params: payload,
    });
    return res;
  },
  async getOrdersCount() {
    // const res = await this.$axiosInstance.$get(`/api/admin/orders/counts`);
    // return res;
  },
  async getBookedOrders({}, payload) {
    const res = await this.$axiosInstance.$get(
      `/api/admin/tariffs/number_of_books`,
      {
        params: payload,
      }
    );
    return res;
  },
  async getCalendar({}, payload) {
    const res = await this.$axiosInstance.$get(
      `/api/admin/calendar/${payload.id}`,
      {
        params: payload.query,
      }
    );
    return res;
  },
  async getOrdersById({}, id) {
    const res = await this.$axiosInstance.$get(`/api/admin/orders/${id}`);
    return res;
  },
  async postOrders({}, data) {
    const res = await this.$axiosInstance.$post(`/api/admin/orders`, data);
    return res;
  },
  async editOrders({}, payload) {
    const res = await this.$axiosInstance.$put(
      `/api/admin/orders/${payload.id}`,
      payload.data
    );
    return res;
  },
  async deleteOrders({}, id) {
    const res = await this.$axiosInstance.$delete(`/api/admin/orders/${id}`);
    return res;
  },
};
