<template lang="html">
  <div class="all-orders">
    <TitleBlock title="Продавцы"> </TitleBlock>

    <div class="container_xl app-container pb-4 pt-5">
      <div class="card_block main-table px-4 py-3">
        <div class="d-flex justify-content-between align-items-center card_header">
          <div class="oroder-filter-grid w-100 align-items-center">
            <SearchInput
              placeholder="Поиск"
              @changeSearch="($event) => changeSearch($event, '__GET_SELLERS')"
            />
            <span></span>
            <span></span>
            <div class="input status-select w-100">
              <a-form-model-item
                class="form-item mb-0"
                :class="{ 'select-placeholder': !value }"
              >
                <a-select v-model="value" placeholder="Статус">
                  <a-select-option
                    v-for="filterItem in statusFilter"
                    :key="filterItem?.id"
                    placeholder="good"
                  >
                    {{ filterItem?.name?.ru }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </div>

            <a-button
              type="primary"
              class="d-flex align-items-center justify-content-center"
              @click="clearQuery('__GET_SELLERS')"
              style="height: 38px"
            >
              <a-icon type="reload"
            /></a-button>
          </div>
        </div>
      </div>
    </div>

    <div class="container_xl app-container main-table">
      <div class="card_block main-table px-4 py-4">
        <a-table
          :columns="columnsSellers"
          :data-source="data"
          :pagination="false"
          :loading="loading"
          align="center"
        >
          <span to="/orders/1232/details" slot="client" slot-scope="text" align="center">
            {{ text }}
          </span>
          <span slot="orderId" slot-scope="text">#{{ text?.id }}</span>

          <span
            slot="status"
            slot-scope="tags"
            class="tags-style"
            :class="{
              tag_success: tags == 'online',
              tag_rejected: tags == 'offline',
            }"
          >
            <!-- 'new', 'canceled', 'accepted', 'in_process' -->
            {{ status[tags] }}
          </span>
          <span slot="btns" slot-scope="text">
            <!-- <span
                  v-if="checkAccess('orders', 'put')"
                  class="action-btn"
                  v-html="eyeIcon"
                  @click="$router.push(`/orders/order/${text}`)"
                >
                </span> -->
            <span
              v-if="checkAccess('orders', 'put')"
              class="action-btn"
              @click="$router.push(`/orders/order/${text}`)"
              v-html="editIcon"
            >
            </span>
            <span class="action-btn" @click="deleteAction(text)" v-html="deleteIcon">
            </span>
          </span>
        </a-table>
        <div class="d-flex justify-content-between mt-4">
          <a-select
            v-model="params.pageSize"
            class="table-page-size"
            style="width: 120px"
            @change="
              ($event) =>
                changePageSizeGlobal($event, '/orders/all-orders', '__GET_SELLERS')
            "
          >
            <a-select-option
              v-for="item in pageSizes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >{{ item.label }}
            </a-select-option>
          </a-select>
          <a-pagination
            class="table-pagination"
            :simple="false"
            v-model.number="current"
            :total="totalPage"
            :page-size.sync="params.pageSize"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchInput from "../../components/form/Search-input.vue";
import TitleBlock from "../../components/Title-block.vue";
import columns from "../../mixins/columns";
import moment from "moment";
import global from "../../mixins/global";
import OrderBtns from "../../components/order-btns.vue";
import authAccess from "../../mixins/authAccess";

export default {
  layout: "toolbar",
  mixins: [columns, global, authAccess],
  data() {
    return {
      statusFilter: [
        {
          name: {
            ru: "Активный",
          },
          id: 1,
        },
        {
          name: {
            ru: "Неактивный",
          },
          id: 2,
        },
      ],
      value: "",
      pageSize: 10,
      eyeIcon: require("../../assets/svg/Eye.svg?raw"),
      editIcon: require("../../assets/svg/edit.svg?raw"),
      deleteIcon: require("../../assets/svg/delete.svg?raw"),
      loading: false,
      orders: [],
      data: [
        {
          id: 1,
          name: "Order name",
          ordersCount: "5",
          date: "24/09/2024",
          status: "online",
        },
        {
          id: 2,
          name: "Order name",
          ordersCount: "5",
          date: "24/09/2024",
          status: "offline",
        },
      ],
      status: {
        online: "В сети",
        offline: "Не в сети",
      },
    };
  },
  mounted() {
    this.getFirstData("__GET_SELLERS");
    this.checkAllActions("orders");
  },
  methods: {
    moment,
    deleteAction(id) {},

    async __GET_SELLERS() {
      console.log("Loading....");
      // this.loading = true;
      // const data = await this.$store.dispatch("fetchOrders/getOrders", {
      //   ...this.$route.query,
      // });
      // this.loading = false;
      // const pageIndex = this.indexPage(
      //   data?.orders?.current_page,
      //   data?.orders?.per_page
      // );
      // this.orders = data?.orders?.data.map((item, index) => {
      //   return {
      //     ...item,
      //     key: index + pageIndex,
      //   };
      // });
      // this.totalPage = data?.orders?.total;
      // this.orders.dataAdd = moment(data?.orders?.created_at).format("DD/MM/YYYY");
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
  },
  watch: {
    async current(val) {
      this.changePagination(val, "__GET_SELLERS");
    },
    async value(val) {
      if (val) {
        if (this.$route.query?.service != val)
          await this.$router.replace({
            path: this.$route.path,
            query: { ...this.$route.query, service: val },
          });
        if (val == this.$route.query.service) this.__GET_SELLERS();
      }
    },
  },
  components: { TitleBlock, SearchInput, OrderBtns },
};
</script>
<style lang="css">
@import "../../assets/css/pages/order.css";
</style>
