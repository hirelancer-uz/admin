<template>
  <div class="">
    <TitleBlock title="Регионы" :breadbrumb="['Настройки сайта']" lastLink="Регионы">
      <div class="d-flex">
        <a-button
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          type="primary"
          @click="addCountries"
          v-if="checkAccess('regions', 'post')"
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
              @changeSearch="changeSearch($event, '/regions', '__GET_REGIONS')"
            />
            <div></div>
            <a-button
              @click="clearQuery('/regions', '__GET_REGIONS')"
              type="primary"
              class="d-flex align-items-center justify-content-center"
              style="height: 38px"
            >
              <a-icon type="reload" />
            </a-button>
          </div>
        </div>
        <a-table
          :columns="columns"
          :pagination="false"
          :data-source="regions"
          :loading="loading"
        >
          <span slot="indexId" slot-scope="text">#{{ text?.key }}</span>
          <span
            @click="editAction(text.id)"
            class="title-link"
            slot="name"
            slot-scope="text"
            >{{ text?.name_ru }}
          </span>
          <span slot="id" slot-scope="text">
            <span
              class="action-btn"
              v-if="checkAccess('regions', 'put')"
              v-html="editIcon"
              @click="editAction(text)"
            >
            </span>
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
              ($event) => changePageSizeGlobal($event, '/regions', '__GET_REGIONS')
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
            <a-form-model-item
              class="form-item mb-3"
              label="Название страны"
              prop="name_ru"
            >
              <a-input v-model="form[`name_${item.index}`]" placeholder="Название..." />
            </a-form-model-item>
            {{ form.country_id }}
            <a-form-model-item label="Страна" prop="country_id" class="form-item mb-3">
              <a-select v-model="form.country_id" class="form-item w-100" placeholder="Status">
                  <a-select-option
                  v-for="item in countries"
                  :key="item?.id"
                  :value="item?.id"
                  :label="item?.name_ru"
                    >{{ item?.name_ru }}
                  </a-select-option>
                </a-select>
              <a-select
                v-model="form.country_id"
                @change="changeCountry"
                placeholder="please select your zone"
              >
                <a-select-option
                  v-for="item in countries"
                  :key="item?.id"
                  :value="item?.id"
                  :label="item?.name_ru"
                >
                  {{ item?.name_ru }}
                </a-select-option>
              </a-select>
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
import SearchInput from "../../components/form/Search-input.vue";
import TitleBlock from "../../components/Title-block.vue";
import status from "../../mixins/status";
import global from "../../mixins/global";
import authAccess from "../../mixins/authAccess";

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
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    className: "column-name",
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
    title: "Регионы",
  },
  mixins: [status, global, authAccess],
  data() {
    return {
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth_token")}`,
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
      ],
      editIcon: require("../../assets/svg/edit.svg?raw"),
      deleteIcon: require("../../assets/svg/delete.svg?raw"),
      addIcon: require("../../assets/svg/add-icon.svg?raw"),
      loading: false,
      columns,
      regions: [],
      rules: {
        name_ru: [
          { required: true, message: "This field is required", trigger: "change" },
        ],
        country_id: [
          { required: true, message: "This field is required", trigger: "change" },
        ],
      },
      form: {
        name_ru: "",
        name_uz: "",
        country_id: undefined,
      },
      countries: [],
    };
  },
  async mounted() {
    this.__GET_COUNTRIES();
    this.getFirstData("__GET_REGIONS");
  },
  methods: {
    changeCountry(e) {
      this.form.country_id = e;
    },
    saveData() {
      this.$refs["ruleForm"][0].validate((valid) => {
        if (valid) {
          this.editId ? this.__EDIT_REGIONS(this.form) : this.__POST_REGIONS(this.form);
        } else {
          return false;
        }
      });
    },

    editAction(id) {
      this.title = "Изменить";
      this.editId = id;
      this.__GET_REGIONS_BY_ID(id);
    },
    deleteAction(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchRegions/deleteRegions",
        "Успешно удален",
        "__GET_REGIONS"
      );
    },
    async __GET_REGIONS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchRegions/getRegions", {
        ...this.$route.query,
      });
      this.loading = false;
      this.loading = false;
      const pageIndex = this.indexPage(
        data?.content?.current_page,
        data?.content?.per_page
      );
      this.totalPage = data?.content?.total;
      this.regions = data?.content?.data.map((item, index) => {
        return {
          ...item,
          key: index + pageIndex,
        };
      });
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
    addCountries() {
      this.title = "Добавить";
      this.editId = null;
      this.visible = true;
    },
    handleOk() {
      this.visible = false;
    },
    async __POST_REGIONS(data) {
      try {
        await this.$store.dispatch("fetchRegions/postRegions", data);
        this.notification("success", "success", "Успешно добавлен");
        this.handleOk();
        this.__GET_REGIONS();
      } catch (e) {
        this.statusFunc(e);
      }
    },
    async __GET_COUNTRIES() {
      const data = await this.$store.dispatch("fetchCountries/getCountries");
      this.countries = data?.content;
    },
    async __GET_REGIONS_BY_ID(targetId) {
      try {
        const data = await this.$store.dispatch("fetchRegions/getRegionsById", targetId);
        this.visible = true;
        const { created_at, updated_at, id, country, ...rest } = data?.content;
        this.form = { ...rest };
        this.form.country_id = data?.content?.country?.id;
        console.log(this.form);
      } catch (e) {
        this.statusFunc(e);
      }
    },
    emptyData() {
      this.form = {
        name_ru: "",
        name_uz: "",
        country_id: undefined,
      };
    },
    async __EDIT_REGIONS(res) {
      try {
        await this.$store.dispatch("fetchRegions/editRegions", {
          id: this.editId,
          data: { ...res, _method: "PUT" },
        });
        this.handleOk();

        this.__GET_REGIONS();
        this.notification("success", "success", "Успешно изменена");
      } catch (e) {
        this.statusFunc(e);
      }
    },
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/regions", "__GET_REGIONS");
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
