<template>
  <div class="">
    <TitleBlock title="Отзывы" :breadbrumb="['Главный']" lastLink="Отзывы">
      <div class="d-flex">
        <a-button
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          type="primary"
          @click="$router.push('/feedbacks/add')"
          v-if="checkAccess('posts', 'post')"
        >
          <span class="svg-icon" v-html="addIcon"> </span>
          Добавить
        </a-button>
      </div>
    </TitleBlock>
    <div class="container_xl app-container pb-5 pt-5">
      <div class="card_block main-table px-4 pb-4">
        <div class="d-flex justify-content-between align-items-center card_header">
          <div class="prodduct-list-header-grid w-100 align-items-center">
            <SearchInput
              placeholder="Поиск"
              @changeSearch="
                ($event) => changeSearch($event, '/feedbacks', '__GET_POSTS')
              "
            />
            <div></div>
            <a-button
              @click="clearQuery('/feedbacks', '__GET_POSTS')"
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
          :data-source="posts"
          :page-size="params.pageSize"
          :loading="loading"
        >
          <span slot="sm_poster" slot-scope="text">
            <img v-if="text != null" class="table-image" :src="text" />
            <img
              v-else
              class="table-image"
              src="../../assets/images/photo_2023-03-04_13-28-58.jpg"
            />
          </span>
          <span slot="indexId" slot-scope="text">#{{ text?.key }}</span>
          <span slot="name" slot-scope="text">{{ text?.ru ? text?.ru : "-----" }}</span>
          <span slot="date" slot-scope="text">{{
            moment(text).format("DD/MM/YYYY")
          }}</span>
          <span slot="desc" slot-scope="text">
            <span v-html="text.ru ? text.ru : '-----'"></span>
          </span>
          <span slot="id" slot-scope="text">
            <span
              class="action-btn"
              v-if="checkAccess('posts', 'put')"
              v-html="editIcon"
              @click="$router.push(`/feedbacks/${text}`)"
            >
            </span>
            <a-popconfirm
              v-if="checkAccess('posts', 'delete')"
              title="Are you sure delete this row?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deleteAction(text)"
            >
              <span class="action-btn" v-html="deleteIcon"> </span>
            </a-popconfirm>
          </span>
        </a-table>
        <div class="d-flex justify-content-between mt-4">
          <a-select
            v-model="params.pageSize"
            class="table-page-size"
            style="width: 120px"
            @change="
              ($event) => changePageSizeGlobal($event, '/feedbacks', '__GET_POSTS')
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
import status from "../../mixins/status";
import global from "../../mixins/global";
import authAccess from "../../mixins/authAccess";
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
    title: "заголовок",
    dataIndex: "md_logo",
    key: "md_logo",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "sm_poster" },
    className: "column-name",
    align: "left",
    width: 55,
    colSpan: 2,
  },
  {
    dataIndex: "name",
    key: "name",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    className: "column-name",
    width: "20%",
    colSpan: 0,
  },
  {
    title: "ДАТА",
    dataIndex: "created_at",
    key: "created_at",
    className: "column-date",
    scopedSlots: { customRender: "date" },
  },
  // {
  //   title: "описание",
  //   dataIndex: "desc",
  //   key: "desc",
  //   className: "column-subservice",
  //   scopedSlots: { customRender: "desc" },
  // },

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
  head: {
    title: "Отзывы",
  },
  middleware: ["auth", "access"],
  mixins: [status, global, authAccess],
  data() {
    return {
      eyeIcon: require("../../assets/svg/Eye.svg?raw"),
      editIcon: require("../../assets/svg/edit.svg?raw"),
      deleteIcon: require("../../assets/svg/delete.svg?raw"),
      addIcon: require("../../assets/svg/add-icon.svg?raw"),
      loading: false,
      search: "",
      columns,
      posts: [],
    };
  },
  async mounted() {
    this.getFirstData("/feedbacks", "__GET_POSTS");
    this.checkAllActions("posts");
  },
  methods: {
    moment,
    // async changeSearch(val) {
    //   this.searchVal = val.target.value;
    //   if (val.target.value.length > 2) {
    //     if (this.$route.query?.search != val.target.value)
    //       await this.$router.replace({
    //         path: "/",
    //         query: { ...this.$route.query, search: val.target.value },
    //       });
    //     if (val.target.value == this.$route.query.search) this.__GET_SERVICES();
    //   } else if (val.target.value.length == 0) {
    //     this.clearQuery(val);
    //   }
    // },
    // async clearQuery(val) {
    //   this.value = "";
    //   const query = { ...this.$route.query, page: 1 };
    //   this.current = 1;
    //   delete query.search;
    //   if (this.$route.query?.search) {
    //     await this.$router.replace({
    //       path: "/",
    //       query: { ...query },
    //     });
    //     this.__GET_SERVICES();
    //   }
    // },
    deleteAction(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchFeedbacks/deleteFeedbacks",
        "Успешно удален",
        "__GET_POSTS"
      );
    },
    async __GET_POSTS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchFeedbacks/getFeedbacks", {
        ...this.$route.query,
      });
      this.loading = false;
      const pageIndex = this.indexPage(
        data?.feedbacks?.current_page,
        data?.feedbacks?.per_page
      );
      this.posts = data?.feedbacks?.data.map((item, index) => {
        return {
          ...item,
          key: index + pageIndex,
        };
      });
      console.log(this.posts);
      this.totalPage = data?.feedbacks?.total;
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/feedbacks", "__GET_POSTS");
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
