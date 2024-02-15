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
        >
          <span class="svg-icon"> </span>
          Добавить
        </a-button>
      </div>
    </TitleBlock>
    <a-form-model :model="formTest" ref="ruleForm" :rules="rules" layout="vertical">
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
                label="Подзаголовок"
                v-for="(elem, index) in formData"
                :key="index"
                :prop="elem.name"
              >
                {{ index }}
                <a-input
                  v-if="elem.type == 'input'"
                  v-model="formTest[elem.name]"
                  placeholder="Подзаголовок"
                />
                <quill-editor
                  v-if="elem.type == 'editor'"
                  v-model="formTest[elem.name]"
                  class="product-editor mt-1"
                  :options="editorOption"
                />
                <div class="clearfix" v-if="elem.type == 'upload'">
                  <a-upload
                    action="https://api.safarpark.uz/api/files/upload"
                    list-type="picture-card"
                    :file-list="fileList"
                    @preview="handlePreview"
                    @change="($event) => handleChange($event, `img`)"
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
              </a-form-model-item>
              <button @click="showData">Show</button>
            </div>
            <span>
              <div class="card_block main-table px-4 py-4">
                <FormTitle title="Параметры" />
                <!-- <div class="clearfix">
                  <a-upload
                    action="https://api.safarpark.uz/api/files/upload"
                    list-type="picture-card"
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
                </div> -->
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
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export default {
  mixins: [status],
  head: {
    title: "Новости",
  },
  data() {
    return {
      editorOption: {
        // Some Quill options...
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
      formTest: {},
      formData: [
        {
          type: "input",
          name: "name",
          value: "",
          required: true,
        },
        {
          type: "input",
          name: "title",
          value: "",
          required: false,
        },
        {
          type: "editor",
          name: "desc",
          value: "",
          required: false,
        },
        {
          type: "upload",
          name: "img",
          value: "",
          required: false,
        },
      ],
    };
  },
  mounted() {
    this.formData.forEach((item) => {
      if (item.type == "upload") {
        this.formTest[item.name] = "";
        this.formTest[`list${item.name}`] = [];
      } else {
        this.formTest[item.name] = "";
      }
      if (item.required) {
        this.rules[item.name] = [
          {
            required: true,
            message: "This field is required",
            trigger: "change",
          },
        ];
      }
    });
  },
  methods: {
    showData() {},
    onSubmit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          // this.__POST_POSTS(this.form);
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
    handleChange({ fileList }, name) {
      this.fileList = fileList;
      if (fileList[0]?.response?.path) this.formTest[name] = fileList[0]?.response?.path;
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
