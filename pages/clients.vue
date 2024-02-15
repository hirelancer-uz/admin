<template>
  <div class="">
    <TitleBlock title="Клиенты" :breadbrumb="['Главный']" lastLink="Клиенты">
    </TitleBlock>
    <div class="container_xl app-container pb-5 pt-5">
      <div class="card_block main-table px-4 pb-4">
        <div class="d-flex justify-content-between align-items-center card_header">
          <div class="prodduct-list-header-grid w-100 align-items-center">
            <SearchInput
              placeholder="Поиск"
              @changeSearch="
                ($event) => changeSearch($event, '/clients', '__GET_CLIENTS')
              "
            />
            <div></div>
            <a-button
              @click="clearQuery('/clients', '__GET_CLIENTS')"
              type="primary"
              class="d-flex align-items-center justify-content-center"
              style="height: 38px"
              ><a-icon type="reload"
            /></a-button>
          </div>
        </div>
        <a-table
          :columns="columns"
          :pagination="false"
          :data-source="faqs"
          :loading="loading"
        >
          <span slot="indexId" slot-scope="text">#{{ text?.key }}</span>
          <span slot="created_at" slot-scope="text">{{
            moment(text).format("DD/MM/YYYY")
          }}</span>
          <span slot="email" slot-scope="text">
            <span>{{ text ? text : "-----" }}</span>
          </span>

          <span slot="id" slot-scope="text">
            <span class="action-btn" @click="showAction(text)" v-html="eyeIcon"> </span>
          </span>
        </a-table>
        <div class="d-flex justify-content-between mt-4">
          <a-select
            v-model="params.pageSize"
            class="table-page-size"
            style="width: 120px"
            @change="
              ($event) => changePageSizeGlobal($event, '/clients', '__GET_CLIENTS')
            "
          >
            <a-select-option
              v-for="item in pageSizes"
              :key="item?.value"
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
import SearchInput from "../components/form/Search-input.vue";
import TitleBlock from "../components/Title-block.vue";
import status from "../mixins/status";
import global from "../mixins/global";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import moment from "moment";

const columns = [
  {
    title: "№",
    key: "indexId",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "indexId" },
    className: "column-service",
    align: "left",
    width: 50,
  },
  {
    title: "Имя",
    dataIndex: "name",
    key: "name",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    className: "column-name",
    align: "left",
  },
  {
    title: "Номер телефона",
    dataIndex: "phone_number",
    key: "phone_number",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "phone_number" },
    className: "column-service",
    align: "left",
  },
  {
    title: "Электронная почта",
    dataIndex: "email",
    key: "email",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "email" },
    className: "column-name",
    align: "left",
  },
  {
    title: "Дата",
    dataIndex: "created_at",
    key: "created_at",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "created_at" },
    className: "column-date",
    align: "right",
  },
  {
    title: "ДЕЙСТВИЯ",
    className: "column-btns",
    dataIndex: "id",
    key: "id",
    align: "right",
    scopedSlots: { customRender: "id" },
    width: 100,
  },
];

export default {
  name: "IndexPage",
  mixins: [status, global],
  head: {
    title: "Клиенты",
  },
  data() {
    return {
      eyeIcon: require("../assets/svg/Eye.svg?raw"),
      loading: false,
      search: "",
      columns,
      faqs: [],
    };
  },
  async mounted() {
    this.getFirstData("/clients", "__GET_CLIENTS");
  },
  methods: {
    moment,
    showAction(id) {
      console.log(id);
      // this.__GET_CLIENTS_BY_ID(id);
      this.$router.push(`/show-client/${id}`);
    },
    async __GET_CLIENTS_BY_ID(id) {
      try {
        const data = await this.$store.dispatch("fetchClients/getClientsById", id);
        this.visible = true;
      } catch (e) {
        this.statusFunc(e);
      }
    },
    async __GET_CLIENTS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchClients/getClients", {
        ...this.$route.query,
      });
      this.loading = false;
      const pageIndex = this.indexPage(
        data?.clients?.current_page,
        data?.clients?.per_page
      );
      this.faqs = data?.clients?.data.map((item, index) => {
        return {
          ...item,
          key: index + pageIndex,
        };
      });
      this.totalPage = data?.clients?.total;
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/clients", "__GET_CLIENTS");
    },
  },
  components: { TitleBlock, SearchInput },
};
</script>
<style lang="css">
.prodduct-list-header-grid {
  display: grid;
  grid-template-columns: 3fr 2fr 40px;
  grid-gap: 8px;
}
.card_header {
  padding: 16.25px 0;
}
</style>
