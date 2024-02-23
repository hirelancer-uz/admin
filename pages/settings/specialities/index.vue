<template>
  <div class="">
    <TitleBlock
      title="Специальности"
      :breadbrumb="['Настройки сайта']"
      lastLink="Специальности"
    >
      <div class="d-flex">
        <a-button
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          type="primary"
          @click="$router.push('/settings/specialities/add')"
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
              @changeSearch="changeSearch($event, '__GET_SPECIAL')"
            />
            <div></div>
            <a-button
              @click="clearQuery('__GET_SPECIAL')"
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
          :data-source="specialities"
          :loading="loading"
        >
          <span slot="indexId" slot-scope="text">#{{ text?.key }}</span>

          <span slot="icon" slot-scope="text">
            <img class="table-image" v-if="text" :src="`${imgUrl}${text}`" alt="" />

            <img
              v-else
              class="table-image"
              src="@/assets/images/photo_2023-03-04_13-28-58.jpg"
              alt=""
            />
          </span>
          <span slot="childs" slot-scope="text">
            <a-tag
              color="blue"
              v-for="item in text"
              :key="item?.id"
              class="cursor-pointer"
              @click="$router.push(`/settings/specialities/${item?.id}`)"
            >
              {{ item?.name_ru }}
            </a-tag>
          </span>

          <span slot="id" slot-scope="text">
            <span class="action-btn" v-html="editIcon" @click="editAction(text)"> </span>
            <a-popconfirm
              title="Are you sure delete this row?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deleteAction(text)"
              v-if="checkAccess('regions', 'delete')"
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
              ($event) => changePageSizeGlobal($event, '__GET_SPECIAL')
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
      width="524px"
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
          <a-form-model :model="form" ref="ruleForm" :rules="rules" layout="vertical">
            <a-form-model-item class="form-item mb-3" label="Название" prop="name_ru">
              <a-input v-model="form[`name_${item.index}`]" placeholder="Название..." />
            </a-form-model-item>
            <a-form-model-item label="Специальности" class="form-item mb-3">
              <a-select v-model="form.parent_id" placeholder="please select your zone">
                <a-select-option
                  v-for="item in specialities"
                  :key="item?.id"
                  :value="item?.id"
                >
                  {{ item?.name_ru }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="Икона" class="form-item mb-3">
              <a-upload
                list-type="picture-card"
                :file-list="fileList"
                :remove="($event) => handleRemove($event, item)"
                :before-upload="handleBeforeUpload"
                :custom-request="($event) => customRequest($event, item)"
              >
                <span v-if="fileList.length == 0"> <a-icon type="upload" /> </span>
              </a-upload>
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
import SearchInput from "@/components/form/Search-input.vue";
import TitleBlock from "@/components/Title-block.vue";
import status from "@/mixins/status";
import global from "@/mixins/global";
import authAccess from "@/mixins/authAccess";

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
    title: "Название ",
    dataIndex: "icon",
    key: "icon",
    slots: { title: "customTitle" },
    className: "column-name",
    scopedSlots: { customRender: "icon" },
    align: "left",
    colSpan: 2,
    width: "45px",
  },
  {
    dataIndex: "name_ru",
    key: "name_ru",
    slots: { title: "customTitle" },
    className: "column-name",
    align: "left",
    colSpan: 0,
  },
  {
    title: "ПОПУЛЯРНЫЙ ",
    dataIndex: "popular",
    key: "popular",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "popular" },

    className: "column-name",
    align: "left",
  },
  {
    title: "Подкатегория ",
    dataIndex: "childs",
    key: "childs",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "childs" },
    className: "column-tags",
    align: "left",
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
    title: "Специальности",
  },
  mixins: [status, global, authAccess],
  data() {
    return {
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
        // {
        //   label: "English",
        //   index: "en",
        // },
      ],
      editIcon: require("@/assets/svg/edit.svg?raw"),
      deleteIcon: require("@/assets/svg/delete.svg?raw"),
      addIcon: require("@/assets/svg/add-icon.svg?raw"),
      loading: false,
      columns,
      specialities: [],
      rules: {
        name_ru: [
          { required: true, message: "This field is required", trigger: "change" },
        ],
        parent_id: [
          { required: true, message: "This field is required", trigger: "change" },
        ],
      },
      form: {
        name_ru: "",
        name_uz: "",
        icon: "",
        parent_id: undefined,
      },
      regions: [],
      fileList: [],
    };
  },
  async mounted() {
    this.getFirstData("__GET_SPECIAL");
    // this.checkAllActions("regions");
  },
  computed: {
    baseUrl() {
      return process.env.BASE_URL;
    },
    imgUrl() {
      return this.baseUrl + "/storage/";
    },
  },
  methods: {
    handleChange(info) {
      if (info.file.status !== "uploading") {
        let formData = new FormData();
        formData.append("icon", info.file.originFileObj);
        console.log(formData);
        this.form.icon = info.file.originFileObj;
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    handleBeforeUpload(file) {
      return true;
    },
    handleRemove(e, name) {
      this.fileList = [];
    },
    customRequest({ onSuccess, onError, file }, name) {
      const reader = new FileReader();
      reader.onload = () => {
        const uploadedFile = {
          uid: file.uid,
          name: file.name,
          originFileObj: file,
          url: reader.result,
        };
        this.fileList.push(uploadedFile);
        onSuccess();
      };
      reader.onerror = () => {
        console.error("Error reading file as binary data");
        onError(new Error("Error reading file"));
      };
      reader.readAsDataURL(file); // Use readAsDataURL to get Base64 data
    },
    saveData() {
      let formData = new FormData();
      formData.append("icon", this.fileList.at(-1).originFileObj);
      if (this.form.icon) {
        formData.append("icon", this.form.icon);
      }
      if (this.editId) {
        formData.append("_method", "PUT");
      }
      formData.append("name_ru", this.form.name_ru);
      formData.append("name_uz", this.form.name_uz);
      formData.append("parent_id", this.form.parent_id ? this.form.parent_id : "");
      this.$refs["ruleForm"][0].validate((valid) => {
        if (valid) {
          this.editId ? this.__EDIT_SPECIAL(formData) : this.__POST_SPECIAL(formData);
        } else {
          return false;
        }
      });
    },

    editAction(id) {
      this.$router.push(`/settings/specialities/${id}`);
      // this.title = "Изменить";
      // this.editId = id;
      // this.__GET_SPECIAL_BY_ID(id);
    },
    deleteAction(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchSpecialities/deleteSpecialities",
        "Успешно удален",
        "__GET_SPECIAL"
      );
    },
    async __GET_SPECIAL() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchSpecialities/getSpecialities", {
        ...this.$route.query,
      });
      this.loading = false;
      this.specialities = data?.content.map((item, index) => {
        let elem = {
          ...item,
          childs: item.children,
          key: index + 1,
        };
        delete elem["children"];
        return elem;
      });
    },

    addCountries() {
      this.title = "Добавить";
      this.editId = null;
      this.visible = true;
    },
    handleOk() {
      this.visible = false;
    },
    async __POST_SPECIAL(data) {
      try {
        await this.$store.dispatch("fetchSpecialities/postSpecialities", data);
        this.notification("success", "success", "Успешно добавлен");
        this.handleOk();
        this.__GET_SPECIAL();
      } catch (e) {
        this.statusFunc(e);
      }
    },

    async __GET_SPECIAL_BY_ID(targetId) {
      try {
        const data = await this.$store.dispatch(
          "fetchSpecialities/getSpecialitiesById",
          targetId
        );
        this.visible = true;
        const { created_at, updated_at, id, ...rest } = data?.content;
        this.form = { ...rest, icon: null };
      } catch (e) {
        this.statusFunc(e);
      }
    },
    emptyData() {
      this.fileList = [];
      this.form = {
        name_ru: "",
        name_uz: "",
        icon: "",
        parent_id: undefined,
      };
    },
    async __EDIT_SPECIAL(res) {
      try {
        await this.$store.dispatch("fetchSpecialities/editSpecialities", {
          id: this.editId,
          data: res,
        });
        this.handleOk();
        this.__GET_SPECIAL();
        this.notification("success", "success", "Успешно изменена");
      } catch (e) {
        this.statusFunc(e);
      }
    },
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/regions", "__GET_SPECIAL");
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
