export const actions = {
  async getRole({}, payload) {
    const res = await this.$axios.$get(`/roles`, {
      params: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async getUsers({}, payload) {
    const res = await this.$axios.$get(`/users`, {
      params: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async getPermissions({}, payload) {
    const res = await this.$axios.$get(`/permissions/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async getRoleById({}, id) {
    try {
      const res = await this.$axios.$get(`/roles/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e;
    }
  },
  async getUsersById({}, id) {
    try {
      const res = await this.$axios.$get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e;
    }
  },
  async postRole({}, data) {
    const res = await this.$axios.$post(`/roles`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async postUser({}, data) {
    const res = await this.$axios.$post(`/users`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async editRole({}, payload) {
    const res = await this.$axios.$put(`/roles/${payload.id}`, payload.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async deleteRole({}, id) {
    const res = await this.$axios.$delete(`/roles/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async deleteUsers({}, id) {
    const res = await this.$axios.$delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
};
