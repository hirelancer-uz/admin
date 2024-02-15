<template>
  <div class="">
    <TitleBlock
      title="Категории (F.A.Q)"
      :breadbrumb="['Главный']"
      lastLink="Категории (F.A.Q)"
    >
      <div class="d-flex">
        <a-button
          v-if="checkAccess('faq_categories', 'post')"
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          type="primary"
          @click="addFaqs"
        >
          <span class="svg-icon" v-html="addIcon"></span>
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
                ($event) => changeSearch($event, '/category_faqs', '__GET_FAQS')
              "
            />
            <span></span>
            <a-button
              @click="clearQuery('/category_faqs', '__GET_FAQS')"
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
          <span slot="title_faq" slot-scope="text">
            <span>{{ text?.ru ? text?.ru : "-----" }}</span>
          </span>

          <span slot="id" slot-scope="text">
            <!-- <span class="action-btn" v-html="eyeIcon"> </span> -->
            <span
              class="action-btn"
              v-html="editIcon"
              v-if="checkAccess('faq_categories', 'put')"
              @click="editAction(text)"
            >
            </span>
            <a-popconfirm
              v-if="checkAccess('faq_categories', 'delete')"
              title="Are you sure delete this row?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deleteAction(text)"
            >
              <span class="action-btn" v-html="deleteIcon"> </span>
            </a-popconfirm>
          </span>
        </a-table>
        <!-- <div class="d-flex justify-content-between mt-4">
          <a-select
            v-model="params.pageSize"
            class="table-page-size"
            style="width: 120px"
            @change="
              ($event) => changePageSizeGlobal($event, '/category_faqs', '__GET_FAQS')
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
        </div> -->
      </div>
    </div>
    <a-modal
      v-model="visible"
      centered
      :title="title"
      :closable="false"
      width="720px"
      @ok="handleOk"
    >
      <div class="d-flex flex-column">
        <div class="form_tab mb-4 bottom_hr">
          <span
            style="border-right: 0"
            v-for="(item, index) in formTabData"
            :key="index"
            @click="formTab = item.index"
            :class="{ 'avtive-formTabModal': formTab == item.index }"
          >
            {{ item.label }}
          </span>
        </div>
        <div
          class="d-flex flex-column"
          v-for="(item, index) in formTabData"
          :key="index"
          v-if="formTab == item.index"
        >
          <a-form-model :model="form" ref="ruleFormFaq" :rules="rules" layout="vertical">
            <a-form-model-item class="form-item mb-3" label="Заголовок" prop="title.ru">
              <a-input v-model="form.title[item.index]" placeholder="Заголовок" />
            </a-form-model-item>
          </a-form-model>
        </div>
      </div>
      <template slot="footer">
        <div class="add_modal-footer d-flex justify-content-end">
          <div
            class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
            @click="handleOk"
          >
            Отмена
          </div>
          <a-button
            class="add-btn add-header-btn btn-primary"
            type="primary"
            @click="saveData"
          >
            Сохранять
          </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import SearchInput from "../components/form/Search-input.vue";
import TitleBlock from "../components/Title-block.vue";
import status from "../mixins/status";
import global from "../mixins/global";
import authAccess from "../mixins/authAccess";

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
    title: "Заголовок",
    dataIndex: "title",
    key: "title",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "title_faq" },
    className: "column-name",
    align: "left",
    width: "45%",
  },
  {
    title: "Дата",
    dataIndex: "created_at",
    key: "created_at",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "created_at" },
    className: "column-date",
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
  mixins: [status, global, authAccess],
  head: {
    title: "F.A.Q",
  },
  data() {
    return {
      editorOption: {
        theme: "snow",
        modules: {
          toolbar: [
            [
              {
                size: [],
              },
            ],
            ["bold", "italic", "underline", "strike"],

            ["image"],
            ["code-block"],
          ],
        },
      },
      title: "Добавить",
      editId: null,
      formTab: "ru",
      visible: false,
      formTabData: [
        {
          label: "Русский",
          index: "ru",
        },
        {
          label: "O'zbek",
          index: "uz",
        },
        {
          label: "English",
          index: "en",
        },
      ],
      eyeIcon: require("../assets/svg/Eye.svg?raw"),
      editIcon: require("../assets/svg/edit.svg?raw"),
      deleteIcon: require("../assets/svg/delete.svg?raw"),
      addIcon: require("../assets/svg/add-icon.svg?raw"),
      loading: false,
      search: "",
      columns,
      faqs: [],
      rules: {
        title: {
          ru: [{ required: true, message: "This field is required", trigger: "change" }],
        },
      },
      form: {
        title: {
          ru: "",
          uz: "",
        },
      },
    };
  },
  async mounted() {
    this.getFirstData("/category_faqs", "__GET_FAQS");
    this.checkAllActions("faq_categories");
  },
  methods: {
    moment,
    saveData() {
      this.$refs["ruleFormFaq"][0].validate((valid) => {
        if (valid) {
          if (this.editId) {
            this.__EDIT_FAQS(this.form);
          } else {
            this.__POST_FAQS(this.form);
          }
        } else {
          return false;
        }
      });
    },
    editAction(id) {
      this.title = "Изменить";
      this.editId = id;
      this.__GET_FAQS_BY_ID(id);
    },
    deleteAction(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchFaqs/deleteFaqsCategories",
        "Успешно удален",
        "__GET_FAQS"
      );
    },
    async __GET_FAQS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchFaqs/getFaqsCategories", {
        ...this.$route.query,
      });
      this.loading = false;
      //   const pageIndex = this.indexPage(data?.categories?.current_page, data?.categories?.per_page);
      this.faqs = data?.categories.map((item, index) => {
        return {
          ...item,
          key: index + 1,
        };
      });
      //   this.totalPage = data?.categories?.total;
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
    addFaqs() {
      this.title = "Добавить";

      this.fileList = [];
      this.editId = null;
      this.visible = true;
    },
    handleOk() {
      this.visible = false;
    },
    async __POST_FAQS(data) {
      try {
        await this.$store.dispatch("fetchFaqs/postFaqsCategories", data);
        this.notification("success", "success", "Успешно добавлен");
        this.handleOk();
        this.__GET_FAQS();
      } catch (e) {
        this.statusFunc(e);
      }
    },
    async __GET_FAQS_BY_ID(id) {
      try {
        const data = await this.$store.dispatch("fetchFaqs/getFaqsCategoriesById", id);
        this.visible = true;
        this.form.title = data?.category?.title;
      } catch (e) {
        this.statusFunc(e);
      }
    },
    emptyData() {
      this.form = {
        title: {
          ru: "",
          uz: "",
        },
      };
    },
    async __EDIT_FAQS(res) {
      try {
        await this.$store.dispatch("fetchFaqs/editFaqsCategories", {
          id: this.editId,
          data: res,
        });
        this.handleOk();
        this.__GET_FAQS();
        this.notification("success", "success", "Успешно изменена");
      } catch (e) {
        this.statusFunc(e);
      }
    },
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/category_faqs", "__GET_FAQS");
    },
    visible(val) {
      if (val == false) {
        this.emptyData();
      }
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
