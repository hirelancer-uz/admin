<template>
  <div class="">
    <TitleBlock title="Галереи" :breadbrumb="['Главный']" lastLink="Галереи">
      <div class="d-flex">
        <a-button
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          type="primary"
          @click="addGalleries"
          v-if="checkAccess('galleries', 'post')"
        >
          <span v-if="!loadingBtn" class="svg-icon" v-html="addIcon"></span>
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
              @changeSearch="changeSearch($event, '/galleries', '__GET_GALLERIES')"
            />
            <div></div>
            <a-button
              @click="clearQuery('/galleries', '__GET_GALLERIES')"
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
          :data-source="galleries"
          :loading="loading"
        >
          <span slot="sm_files" slot-scope="text">
            <img v-if="text.length > 0" class="table-image" :src="text[0]" />
            <img
              v-else
              class="table-image"
              src="../assets/images/photo_2023-03-04_13-28-58.jpg"
            />
          </span>
          <span slot="indexId" slot-scope="text">#{{ text?.key }}</span>
          <span slot="name" slot-scope="text">{{ text?.ru ? text?.ru : "-----" }}</span>
          <span slot="subtitle" slot-scope="text">{{
            text?.ru ? text?.ru : "-----"
          }}</span>
          <span slot="desc" slot-scope="text">
            <span v-html="text?.ru ? text?.ru : '-----'"></span>
          </span>
          <span slot="id" slot-scope="text">
            <span
              class="action-btn"
              v-if="checkAccess('galleries', 'put')"
              v-html="editIcon"
              @click="editAction(text)"
            >
            </span>
            <a-popconfirm
              title="Are you sure delete this row?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deleteAction(text)"
              v-if="checkAccess('galleries', 'delete')"
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
              ($event) => changePageSizeGlobal($event, '/galleries', '__GET_GALLERIES')
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
            v-for="(item, index) in formTabData"
            :key="index"
            @click="formTab = item.index"
            :class="{ 'avtive-formTab': formTab == item.index }"
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
          <a-form-model
            :model="form"
            ref="ruleFormGalleries"
            :rules="rules"
            layout="vertical"
          >
            <a-form-model-item
              class="form-item mb-3"
              label="Заголовок"
              :prop="item.index == 'ru' ? 'title.ru' : ''"
            >
              <a-input v-model="form.title[item.index]" placeholder="Заголовок" />
            </a-form-model-item>
            <a-form-model-item class="form-item mb-3" label="Описание">
              <quill-editor
                class="product-editor mt-1"
                v-model="form.desc[item.index]"
                :options="editorOption"
              />
            </a-form-model-item>
          </a-form-model>
          <div class="clearfix">
            <a-upload
              action="https://api.safarpark.uz/api/files/upload"
              list-type="picture-card"
              :file-list="fileList"
              :headers="headers"
              :multiple="true"
              @preview="handlePreview"
              @change="handleChange"
            >
              <div v-if="fileList.length < 8">
                <a-icon type="plus" />
                <div class="ant-upload-text">Загрузить</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
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
            :loading="loadingBtn"
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
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
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
    dataIndex: "sm_files",
    key: "sm_files",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "sm_files" },
    className: "column-name",
    align: "left",
    colSpan: 2,
  },
  {
    dataIndex: "title",
    key: "title",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    className: "column-name",
    colSpan: 0,
  },
  {
    title: "описание",
    dataIndex: "desc",
    key: "desc",
    className: "column-subservice",
    scopedSlots: { customRender: "desc" },
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
  head: {
    title: "Галереи",
  },
  mixins: [status, global, authAccess],
  data() {
    return {
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
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
      loadingBtn: false,
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
      galleries: [],
      previewVisible: false,
      previewImage: "",
      fileList: [],
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
        desc: {
          ru: "",
          uz: "",
        },
        files: [],
      },
    };
  },
  async mounted() {
    this.getFirstData("/galleries", "__GET_GALLERIES");
    this.checkAllActions("galleries");
  },
  methods: {
    saveData() {
      this.$refs["ruleFormGalleries"][0].validate((valid) => {
        if (valid) {
          if (this.editId) {
            this.__EDIT_GALLERIES(this.form);
          } else {
            this.__POST_GALLERIES(this.form);
          }
        } else {
          return false;
        }
      });
    },

    editAction(id) {
      this.title = "Изменить";
      this.editId = id;
      this.__GET_GALLERIES_BY_ID(id);
    },
    deleteAction(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchGalleries/deleteGalleries",
        "Успешно удален",
        "__GET_GALLERIES"
      );
    },
    async __GET_GALLERIES() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchGalleries/getGalleries", {
        ...this.$route.query,
      });
      this.loading = false;
      const pageIndex = this.indexPage(
        data?.galleries?.current_page,
        data?.galleries?.per_page
      );
      this.galleries = data?.galleries?.data.map((item, index) => {
        return {
          ...item,
          key: index + pageIndex,
        };
      });
      this.totalPage = data?.galleries?.total;
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
    addGalleries() {
      this.title = "Добавить";
      this.fileList = [];
      this.editId = null;
      this.visible = true;
    },
    handleOk() {
      this.visible = false;
    },
    async __POST_GALLERIES(data) {
      try {
        await this.$store.dispatch("fetchGalleries/postGalleries", data);
        this.notification("success", "success", "Успешно добавлен");
        this.handleOk();
        this.__GET_GALLERIES();
      } catch (e) {
        this.statusFunc(e);
      }
    },
    async __GET_GALLERIES_BY_ID(id) {
      try {
        const data = await this.$store.dispatch("fetchGalleries/getGalleriesById", id);
        this.visible = true;
        this.form = data?.gallery;
        this.fileList = [];
        data?.gallery.sm_files.forEach((item, index) => {
          data?.gallery.files.forEach((elem, ind) => {
            if (index == ind) {
              this.fileList.push({
                uid: `-${index}`,
                name: "image.png",
                status: "done",
                oldImg: true,
                url: item,
                response: {
                  path: elem,
                },
              });
            }
          });
        });
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
        desc: {
          ru: "",
          uz: "",
        },
        files: [],
      };
    },
    async __EDIT_GALLERIES(res) {
      try {
        await this.$store.dispatch("fetchGalleries/editGalleries", {
          id: this.editId,
          data: res,
        });
        this.handleOk();

        this.__GET_GALLERIES();
        this.notification("success", "success", "Успешно изменена");
        this.$router.push("/galleries");
      } catch (e) {
        this.statusFunc(e);
      }
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      this.loadingBtn = true;
      this.fileList = fileList;
      if (fileList[0]?.response?.path) {
        this.form.files = fileList.map((item) => item?.response?.path);
        this.loadingBtn = false;
      } else if (fileList.length == 0 || this.form.files > fileList.length) {
        this.form.files = fileList.map((item) => item?.response?.path);
        this.loadingBtn = false;
      }
    },
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/galleries", "__GET_GALLERIES");
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
