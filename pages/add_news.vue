<template lang="html">
  <div class="posts">
    <TitleBlock title="Новости" :breadbrumb="['Главный']" lastLink="Новости">
      <div class="d-flex">
        <div
          class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
          @click="$router.push('/news')"
        >
          Отмена
        </div>
        <a-button
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          type="primary"
          @click="onSubmit"
          v-if="checkAccess('posts', 'post')"
        >
          <span class="svg-icon"> </span>
          Добавить
        </a-button>
      </div>
    </TitleBlock>
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
              <FormTitle title="Новости" />
              <a-form-model-item
                class="form-item mb-3"
                label="Заголовок"
                :prop="item.index == 'ru' ? 'title.ru' : ''"
              >
                <a-input v-model="form.title[item.index]" placeholder="Заголовок" />
              </a-form-model-item>
              <a-form-model-item class="form-item mb-3" label="Подзаголовок">
                <a-input v-model="form.subtitle[item.index]" placeholder="Подзаголовок" />
              </a-form-model-item>
              <a-form-model-item class="form-item mb-3" label="Описание">
                <quill-editor
                  v-model="form.desc[item.index]"
                  class="product-editor mt-1"
                  :options="editorOption"
                />
              </a-form-model-item>
            </div>
            <span>
              <div class="card_block main-table px-4 py-4">
                <FormTitle title="Параметры" />
                <a-select v-model="value" class="form-item w-100" placeholder="Status">
                  <a-select-option
                    v-for="item in [1, 2, 3]"
                    :key="item"
                    :label="item"
                    :value="item"
                    >{{ item }}
                  </a-select-option>
                </a-select>
                <div class="clearfix">
                  <a-upload
                    action="https://api.safarpark.uz/api/files/upload"
                    list-type="picture-card"
                    :headers="headers"
                    :file-list="fileList"
                    @preview="handlePreview"
                    @change="handleChange"
                  >
                    <div v-if="fileList.length < 1">
                      <a-icon type="plus" />
                      <div class="ant-upload-text">Загрузить</div>
                    </div>
                  </a-upload>
                  <a-modal
                    :visible="previewVisible"
                    :footer="null"
                    @cancel="handleCancel"
                  >
                    <img alt="example" style="width: 100%" :src="previewImage" />
                  </a-modal>
                </div>
                <!-- <a-form-model-item class="form-item mb-3" label="Instagram">
                <a-input v-model="form.instagram" placeholder="link" />
              </a-form-model-item>
              <a-form-model-item class="form-item mb-3" label="Telegram">
                <a-input v-model="form.telegram" placeholder="link" />
              </a-form-model-item>
              <a-form-model-item class="form-item mb-3" label="Facebook">
                <a-input v-model="form.facebook" placeholder="link" />
              </a-form-model-item> -->
              </div>
            </span>
          </div>
        </div>
      </div>
    </a-form-model>
  </div>
</template>
<script>
import FormTitle from "../components/Form-title.vue";
import TitleBlock from "../components/Title-block.vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import status from "../mixins/status";
import authAccess from "../mixins/authAccess";

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
      value: undefined,
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
        },
        subtitle: {
          ru: "",
          uz: "",
        },
        desc: {
          ru: "",
          uz: "",
        },
        poster: "",
        instagram: "",
        telegram: "",
        facebook: "",
      },
      previewVisible: false,
      previewImage: "",
      fileList: [],
    };
  },
  methods: {
    onSubmit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.__POST_POSTS(this.form);
        } else {
          return false;
        }
      });
    },
    async __POST_POSTS(data) {
      try {
        await this.$store.dispatch("fetchPosts/postPosts", data);
        this.notification("success", "success", "Успешно добавлен");
        this.$router.push("/news");
      } catch (e) {
        this.statusFunc(e);
      }
    },
    handleChange({ fileList }) {
      this.fileList = fileList;
      if (fileList[0]?.response?.path) this.form.poster = fileList[0]?.response?.path;
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
</style>
