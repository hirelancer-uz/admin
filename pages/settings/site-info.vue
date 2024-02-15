<template lang="html">
  <div class="site-info">
    <TitleBlock
      title="Общие данные"
      :breadbrumb="['Настройки сайта']"
      lastLink="Общие данные"
    >
      <div class="d-flex">
        <a-button
          v-if="checkAccess('site_infos', 'put') && checkAccess('site_infos', 'post')"
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          type="primary"
          @click="onSubmit"
        >
          <span class="svg-icon"> </span>
          Сохранить
        </a-button>
      </div>
    </TitleBlock>
    <a-spin :spinning="spinning" :delay="delayTime">
      <a-form-model :model="form" ref="ruleForm" :rules="rules" layout="vertical">
        <div class="pb-5 pt-5">
          <div class="container_xl app-container d-flex flex-column">
            <div class="form_tab">
              <div>
                <span
                  v-for="(item, index) in formTabData"
                  :key="index"
                  @click="formTab = item.index"
                  :class="{ 'avtive-formTab': formTab == item.index }"
                >
                  {{ item.label }}
                </span>
              </div>
            </div>
            <div class="posts-grid">
              <div
                class="card_block main-table px-4 py-4 border-left-radius"
                v-for="(item, index) in formTabData"
                :key="index"
                v-if="formTab == item.index"
              >
                <div class="d-flex gx-5" style="gap: 16px">
                  <a-form-model-item
                    class="form-item mb-3 w-100"
                    label="Заголовок"
                    :prop="item.index == 'ru' ? 'title.ru' : ''"
                  >
                    <a-input v-model="form.title[item.index]" placeholder="Заголовок" />
                  </a-form-model-item>
                  <a-form-model-item class="form-item mb-3 w-100" label="Подзаголовок">
                    <a-input
                      v-model="form.subtitle[item.index]"
                      placeholder="Подзаголовок"
                    />
                  </a-form-model-item>
                </div>

                <a-form-model-item class="form-item mb-3" label="Описание">
                  <quill-editor
                    v-model="form.desc[item.index]"
                    class="product-editor mt-1"
                    :options="editorOption"
                  />
                </a-form-model-item>
                <a-form-model-item class="form-item mb-3" label="Описание (Партнеры)">
                  <quill-editor
                    v-model="form.become_partner[item.index]"
                    class="product-editor mt-1"
                    :options="editorOption"
                  />
                </a-form-model-item>
                <a-form-model-item class="form-item mb-3 w-100" label="Адрес">
                  <a-input
                    type="textarea"
                    rows="3"
                    v-model="form.addresses[item.index]"
                    placeholder="Адрес"
                  />
                </a-form-model-item>
                <a-form-model-item class="form-item mb-3 w-100" label="Время работы">
                  <a-input
                    type="textarea"
                    rows="3"
                    v-model="form.working_houses[item.index]"
                    placeholder="Время работы"
                  />
                </a-form-model-item>
                <a-form-model-item class="form-item mb-3 w-100" label="Номер телефона">
                  <a-input placeholder="(___) ___-____" v-model="form.phone_numbers" />
                </a-form-model-item>
                <a-form-model-item class="form-item mb-3 w-100" label="Галереи">
                  <div class="galleries-grid-1">
                    <a-upload
                      action="https://api.safarpark.uz/api/files/upload"
                      list-type="picture-card"
                      :file-list="fileListGalleries.list_1"
                      :headers="headers"
                      @preview="handlePreview"
                      @change="($event) => handleChangeGaleries($event, 1)"
                    >
                      <div v-if="fileListGalleries.list_1.length < 1">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">Загрузить</div>
                      </div>
                    </a-upload>
                    <a-upload
                      action="https://api.safarpark.uz/api/files/upload"
                      list-type="picture-card"
                      :file-list="fileListGalleries.list_2"
                      :headers="headers"
                      @preview="handlePreview"
                      @change="($event) => handleChangeGaleries($event, 2)"
                    >
                      <div v-if="fileListGalleries.list_2.length < 1">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">Загрузить</div>
                      </div>
                    </a-upload>
                    <a-upload
                      action="https://api.safarpark.uz/api/files/upload"
                      list-type="picture-card"
                      :file-list="fileListGalleries.list_3"
                      :headers="headers"
                      @preview="handlePreview"
                      @change="($event) => handleChangeGaleries($event, 3)"
                    >
                      <div v-if="fileListGalleries.list_3.length < 1">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">Загрузить</div>
                      </div>
                    </a-upload>
                  </div>
                  <div class="galleries-grid-2">
                    <a-upload
                      action="https://api.safarpark.uz/api/files/upload"
                      list-type="picture-card"
                      :file-list="fileListGalleries.list_4"
                      :headers="headers"
                      @preview="handlePreview"
                      @change="($event) => handleChangeGaleries($event, 4)"
                    >
                      <div v-if="fileListGalleries.list_4.length < 1">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">Загрузить</div>
                      </div>
                    </a-upload>
                    <a-upload
                      action="https://api.safarpark.uz/api/files/upload"
                      list-type="picture-card"
                      :file-list="fileListGalleries.list_5"
                      :headers="headers"
                      @preview="handlePreview"
                      @change="($event) => handleChangeGaleries($event, 5)"
                    >
                      <div v-if="fileListGalleries.list_5.length < 1">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">Загрузить</div>
                      </div>
                    </a-upload>
                    <a-upload
                      action="https://api.safarpark.uz/api/files/upload"
                      list-type="picture-card"
                      :file-list="fileListGalleries.list_6"
                      :headers="headers"
                      @preview="handlePreview"
                      @change="($event) => handleChangeGaleries($event, 6)"
                    >
                      <div v-if="fileListGalleries.list_6.length < 1">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">Загрузить</div>
                      </div>
                    </a-upload>
                  </div>
                </a-form-model-item>
              </div>
              <span>
                <div class="card_block px-4 py-4">
                  <a-form-model-item class="form-item mb-3" label="Email">
                    <a-input v-model="form.emails" placeholder="link" />
                  </a-form-model-item>
                  <a-form-model-item class="form-item mb-3" label="Instagram">
                    <a-input v-model="form.instagram" placeholder="link" />
                  </a-form-model-item>
                  <a-form-model-item class="form-item mb-3" label="Telegram">
                    <a-input v-model="form.telegram" placeholder="link" />
                  </a-form-model-item>
                  <a-form-model-item class="form-item mb-3" label="Facebook">
                    <a-input v-model="form.facebook" placeholder="link" />
                  </a-form-model-item>
                  <a-form-model-item class="form-item mb-3" label="YouTube">
                    <a-input v-model="form.youtube" placeholder="link" />
                  </a-form-model-item>
                  <a-form-model-item
                    class="form-item mb-3"
                    label="Втсавить карту(iframe)"
                  >
                    <a-input v-model="form.map" placeholder="iframe" />
                  </a-form-model-item>
                  <div class="clearfix d-flex">
                    <a-form-model-item class="form-item mb-3 w-100" label="Лого">
                      <a-upload
                        action="https://api.safarpark.uz/api/files/upload"
                        list-type="picture-card"
                        :headers="headers"
                        :file-list="fileListLogo"
                        @preview="handlePreview"
                        @change="($event) => handleChange($event, 'logo')"
                      >
                        <div v-if="fileListLogo.length < 1">
                          <a-icon type="plus" />
                          <div class="ant-upload-text">Загрузить</div>
                        </div>
                      </a-upload>
                    </a-form-model-item>
                    <a-form-model-item class="form-item mb-3 w-100" label="Favicon">
                      <a-upload
                        action="https://api.safarpark.uz/api/files/upload"
                        list-type="picture-card"
                        :file-list="fileListFavicon"
                        :headers="headers"
                        @preview="handlePreview"
                        @change="($event) => handleChange($event, 'favicon')"
                      >
                        <div v-if="fileListFavicon.length < 1">
                          <a-icon type="plus" />
                          <div class="ant-upload-text">Загрузить</div>
                        </div>
                      </a-upload>
                    </a-form-model-item>
                    <a-modal
                      :visible="previewVisible"
                      :footer="null"
                      @cancel="handleCancel"
                    >
                      <img alt="example" style="width: 100%" :src="previewImage" />
                    </a-modal>
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
      </a-form-model>
    </a-spin>
  </div>
</template>
<script>
import FormTitle from "../../components/Form-title.vue";
import TitleBlock from "../../components/Title-block.vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import status from "../../mixins/status";
import authAccess from "../../mixins/authAccess";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export default {
  mixins: [status, authAccess],
  head: {
    title: "Новости",
  },
  data() {
    return {
      delayTime: 0,
      spinning: false,
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      editorOption: {
        theme: "snow",
        modules: {
          toolbar: [
            [
              {
                font: [],
              },
              {
                size: [],
              },
            ],
            ["bold", "italic", "underline", "strike"],
            [
              {
                color: [],
              },
              {
                background: [],
              },
            ],
            [
              {
                script: "super",
              },
              {
                script: "sub",
              },
            ],
            [
              {
                header: [false, 1, 2, 3, 4, 5, 6],
              },
              "blockquote",
              "code-block",
            ],
            [
              {
                list: "ordered",
              },
              {
                list: "bullet",
              },
              {
                indent: "-1",
              },
              {
                indent: "+1",
              },
            ],
            [
              "direction",
              {
                align: [],
              },
            ],
            ["link", "image", "video"],
            ["clean"],
          ],
        },
      },
      formTab: "ru",
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
      rules: {
        title: {
          ru: [
            {
              required: true,
              message: "This field is required",
              trigger: "change",
            },
          ],
        },
      },
      form: {
        title: {
          ru: "",
          uz: "",
          en: "",
        },
        subtitle: {
          ru: "",
          uz: "",
          en: "",
        },
        become_partner: {
          ru: "",
          uz: "",
          en: "",
        },
        desc: {
          ru: "",
          uz: "",
          en: "",
        },
        addresses: {
          ru: "",
          uz: "",
          en: "",
        },
        working_houses: {
          ru: "",
          uz: "",
          en: "",
        },
        phone_numbers: "",
        emails: "",
        instagram: "",
        facebook: "",
        youtube: "",
        telegram: "",
        map: "",
        logo: "",
        favicon: "",
        photo1: "",
        photo2: "",
        photo3: "",
        photo4: "",
        photo5: "",
        photo6: "",
      },
      previewVisible: false,
      previewImage: "",
      fileListLogo: [],
      fileListFavicon: [],
      fileListGalleries: {
        list_1: [],
        list_2: [],
        list_3: [],
        list_4: [],
        list_5: [],
        list_6: [],
      },
    };
  },
  mounted() {
    this.__GET_STATIC_INFO();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  },
  methods: {
    onSubmit() {
      const {
        id,
        created_at,
        lg_favicon,
        lg_logo,
        md_favicon,
        md_logo,
        sm_favicon,
        sm_logo,
        updated_at,
        lg_photo1,
        lg_photo2,
        lg_photo3,
        lg_photo4,
        lg_photo5,
        lg_photo6,
        sm_photo1,
        sm_photo2,
        sm_photo3,
        sm_photo4,
        sm_photo5,
        sm_photo6,
        md_photo1,
        md_photo2,
        md_photo3,
        md_photo4,
        md_photo5,
        md_photo6,
        ...rest
      } = this.form;
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.__POST_STATIC_INFO(rest);
        } else {
          return false;
        }
      });
    },
    async __POST_STATIC_INFO(data) {
      try {
        await this.$store.dispatch("fetchStaticInfo/postStaticInfo", data);
        this.notification("success", "success", "Успешно изменена");
      } catch (e) {
        this.statusFunc(e);
      }
    },
    async __GET_STATIC_INFO() {
      try {
        this.spinning = true;
        const data = await this.$store.dispatch("fetchStaticInfo/getStaticInfo");
        if (data.info) {
          this.form = { ...data.info };
          this.form.become_partner = data.info?.become_partner
            ? data.info?.become_partner
            : {
                ru: "",
                uz: "",
                en: "",
              };
          if (this.form.sm_logo) {
            this.fileListLogo = [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                oldImg: true,
                url: this.form.sm_logo,
              },
            ];
          }
          if (this.form.sm_favicon) {
            this.fileListFavicon = [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                oldImg: true,
                url: this.form.sm_favicon,
              },
            ];
          }
          Object.keys(this.fileListGalleries).forEach((item, index) => {
            if (this.form[`photo${index + 1}`]) {
              this.fileListGalleries[item] = [
                {
                  uid: "-1",
                  name: "image.png",
                  status: "done",
                  oldImg: true,
                  url: this.form[`sm_photo${index + 1}`],
                },
              ];
            }
          });
        }
        this.spinning = false;
      } catch (e) {
        this.statusFunc(e);
        this.spinning = false;
      }
    },
    handleChange({ fileList }, name) {
      if (name == "logo") {
        this.fileListLogo = fileList;
      } else {
        this.fileListFavicon = fileList;
      }
      console.log(fileList);
      if (fileList[0]?.response?.path) {
        this.form[name] = fileList[0]?.response?.path;
      } else {
        this.form[name] = null;
      }
    },
    handleChangeGaleries({ fileList }, index) {
      this.fileListGalleries[`list_${index}`] = fileList;
      if (fileList[0]?.response?.path) {
        this.form[`photo${index}`] = fileList[0]?.response?.path;
      } else {
        this.form[`photo${index}`] = "";
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
  },
  components: { TitleBlock, FormTitle },
};
</script>
<style lang="css">
.posts-grid {
  display: grid;
  grid-gap: 13px;
  grid-template-columns: 5fr 2fr;
}
.posts .ant-upload.ant-upload-select-picture-card,
.posts .ant-upload-list-picture-card .ant-upload-list-item,
.posts .ant-upload-list-picture-card-container {
  width: 100% !important;
  height: 150px !important;
}
.tel_number_input:focus {
  outline: none;
}
.galleries-grid-1 {
  display: grid;
  grid-template-columns: 1fr 1.8fr 1.5fr;
  grid-gap: 10px;
}
.galleries-grid-2 {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1.5fr;
  grid-gap: 10px;
}
.site-info .galleries-grid-1 .ant-upload.ant-upload-select-picture-card,
.site-info .galleries-grid-2 .ant-upload.ant-upload-select-picture-card,
.site-info .galleries-grid-1 .ant-upload-list-picture-card-container,
.site-info .galleries-grid-2 .ant-upload-list-picture-card-container,
.site-info .galleries-grid-1 .ant-upload-list-picture-card .ant-upload-list-item,
.site-info .galleries-grid-2 .ant-upload-list-picture-card .ant-upload-list-item {
  width: 100%;
  height: 180px;
}
</style>
