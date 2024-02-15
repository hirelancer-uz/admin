<template>
  <div class="">
    <TitleBlock title="Услуги " :breadbrumb="['Главный']" lastLink="Услуги">
      <div class="d-flex justify-content-between btn_group">
        <a-button
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          :type="
            $route.hash == '#total_info' || $route.hash == '' ? 'primary' : 'default'
          "
          @click="$router.push({ hash: 'total_info' })"
        >
          Общие данные
        </a-button>
        <a-button
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          :type="$route.hash == '#sessions_tariffs' ? 'primary' : 'default'"
          @click="$router.push({ hash: 'sessions_tariffs' })"
        >
          Сеансы и тарифы
        </a-button>
        <a-button
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          :type="$route.hash == '#faq' ? 'primary' : 'default'"
          @click="$router.push({ hash: 'faq' })"
        >
          FAQ
        </a-button>
        <a-button
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          :type="$route.hash == '#reviews' ? 'primary' : 'default'"
          @click="$router.push({ hash: 'reviews' })"
        >
          Отзывы
        </a-button>
      </div>
      <div class="d-flex">
        <div
          class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
          @click="$router.push('/')"
        >
          Отмена
        </div>
        <a-button
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          type="primary"
          v-if="checkAccess('services', 'put')"
          @click="
            $router.push({
              name: `edit_park_services`,
              hash: $route.hash,
            })
          "
        >
          <span class="svg-icon"> </span>
          Редактировать
        </a-button>
      </div>
    </TitleBlock>
    <a-form-model
      :model="form"
      ref="ruleForm"
      :rules="rules"
      layout="vertical"
      :wrapper-col="wrapperCol"
    >
      <a-spin :spinning="spinning" :delay="delayTime">
        <div class="services-grid pb-5 mt-5">
          <div
            class="container_xl app-container d-flex flex-column"
            v-if="$route.hash == '' || $route.hash == '#total_info'"
          >
            <div class="form_tab">
              <div>
                <span
                  v-for="(item, index) in formTabData"
                  :key="index"
                  @click="formTab.name = item.index"
                  :class="{ 'avtive-formTab': formTab.name == item.index }"
                >
                  {{ item.label }}
                </span>
              </div>
            </div>
            <div
              class="card_block px-4 py-4 border-left-radius"
              v-for="(item, index) in formTabData"
              :key="index"
              v-if="formTab.name == item.index"
            >
              <a-form-model-item class="form-item mb-3" label="Название сервиса">
                <a-input
                  v-model="form.name[item.index]"
                  placeholder="Название сервиса..."
                  disabled
                />
              </a-form-model-item>

              <a-form-model-item
                class="form-item mb-0"
                label="Краткая информация о сервисе"
              >
                <quill-editor
                  v-model="form.desc[item.index]"
                  class="product-editor mt-1"
                  :options="editorOption"
                  disabled
                  placeholder="Краткая информация о сервисе..."
                />
              </a-form-model-item>
              <div class="service-upload-container">
                <a-form-model-item class="form-item mb-3 mt-3" label="Баннер">
                  <div class="service-upload">
                    <a-upload
                      action="https://api.safarpark.uz/api/files/upload"
                      list-type="picture-card"
                      :file-list="fileBanner"
                      :headers="headers"
                      :disabled="true"
                      @preview="handlePreview"
                      @change="($event) => handleChangeServiceUpload($event, 'banner')"
                    >
                      <div v-if="fileBanner.length < 1">
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
                <a-form-model-item class="form-item mb-3 mt-3" label="Карточка">
                  <div class="service-upload">
                    <a-upload
                      action="https://api.safarpark.uz/api/files/upload"
                      list-type="picture-card"
                      :file-list="fileForCard"
                      :headers="headers"
                      :disabled="true"
                      @preview="handlePreview"
                      @change="($event) => handleChangeServiceUpload($event, 'for_card')"
                    >
                      <div v-if="fileForCard.length < 1">
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
              </div>
              <a-form-model-item class="form-item mb-3" label="Галереи">
                <div class="service-galleries">
                  <a-upload
                    action="https://api.safarpark.uz/api/files/upload"
                    list-type="picture-card"
                    :multiple="true"
                    :headers="headers"
                    :disabled="true"
                    :file-list="fileGalleries"
                    @preview="handlePreview"
                    @change="($event) => handleChangeGalleriesUpload($event, 'banner')"
                  >
                    <div v-if="fileGalleries.length < 1">
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
            </div>
          </div>
          <div
            class="container_xl app-container d-flex flex-column"
            v-if="$route.hash == '' || $route.hash == '#total_info'"
          >
            <div class="form_tab">
              <div>
                <span
                  v-for="(item, index) in formTabData"
                  :key="index"
                  @click="formTab.guarantee = item.index"
                  :class="{ 'avtive-formTab': formTab.guarantee == item.index }"
                >
                  {{ item.label }}
                </span>
              </div>
            </div>

            <div
              class="card_block border-left-radius px-4 py-4 mt-0"
              v-for="(item, index) in formTabData"
              :key="index"
              v-if="formTab.guarantee == item.index"
            >
              <a-form-model-item class="form-item mb-0" label="Добавить статистику">
                <div class="mt-3 statistic-grid">
                  <div v-for="card in form.cards" class="d-flex">
                    <div class="clearfix">
                      <a-upload
                        disabled
                        action="https://api.safarpark.uz/api/files/upload"
                        list-type="picture-card"
                        :headers="headers"
                        :file-list="card.imgList"
                        @preview="handlePreview"
                        @change="($event) => handleChangeCards($event, card.indexId)"
                      >
                        <div v-if="card.imgList.length < 1">
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
                    <div class="d-flex flex-column justify-content-between w-100">
                      <a-form-model-item class="form-item mb-3">
                        <a-input
                          disabled
                          v-model="card.name[item.index]"
                          placeholder="Название"
                        />
                      </a-form-model-item>
                      <!-- <a-form-model-item class="form-item mb-3">
                      <a-input
                        v-model="card.name[item.index]"
                        placeholder="Название"
                      />
                    </a-form-model-item> -->
                    </div>
                  </div>
                </div>
              </a-form-model-item>
              <div
                class="grid-with-btn"
                v-for="(moment, index) in form.moments"
                :key="moment.indexId"
              >
                <a-form-model-item
                  class="form-item mb-3"
                  :label="index == 0 ? 'Основные моменты' : ''"
                >
                  <a-input
                    disabled
                    v-model="moment.title[item.index]"
                    placeholder="Text"
                  />
                </a-form-model-item>
                <!-- <div class="d-flex align-items-center">
                <div
                  class="variant-btn variant-btn-delete mt-3"
                  v-html="xIcon"
                  @click="deleteMoments(moment.indexId)"
                ></div>
              </div> -->
              </div>
              <!-- <div class="create-inner-variant mt-4" @click="addMoments">
              <span v-html="plusIcon"> </span>
              Добавить
            </div> -->
            </div>
          </div>
          <div
            class="container_xl app-container d-flex flex-column"
            v-if="$route.hash == '' || $route.hash == '#total_info'"
          >
            <div class="form_tab">
              <div>
                <span
                  v-for="(item, index) in formTabData"
                  :key="index"
                  @click="formTab.guarantee = item.index"
                  :class="{ 'avtive-formTab': formTab.guarantee == item.index }"
                >
                  {{ item.label }}
                </span>
              </div>
            </div>
            <div
              class="card_block border-left-radius px-4 py-4 mt-0"
              v-for="(item, index) in formTabData"
              :key="index"
              v-if="formTab.guarantee == item.index"
            >
              <a-form-model-item class="form-item mb-0" label="Основная информация">
                <quill-editor
                  v-model="form.guarantee[item.index]"
                  class="product-editor mt-1"
                  disabled
                  :options="editorOption"
                />
              </a-form-model-item>
              <div class="mt-3 statistic-grid">
                <div v-for="statistic in form.statistics" class="d-flex">
                  <div class="clearfix">
                    <a-upload
                      action="https://api.safarpark.uz/api/files/upload"
                      list-type="picture-card"
                      :disabled="true"
                      :headers="headers"
                      :file-list="statistic.statisticFile"
                      @preview="handlePreview"
                      @change="
                        ($event) => handleChangeStatistic($event, statistic.indexId)
                      "
                    >
                      <div v-if="statistic.statisticFile.length < 1">
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
                  <div class="d-flex flex-column justify-content-between w-100">
                    <a-form-model-item class="form-item mb-3">
                      <a-input
                        v-model="statistic.name[item.index]"
                        disabled
                        placeholder="Число"
                      />
                    </a-form-model-item>
                    <a-form-model-item class="form-item mb-3">
                      <a-input
                        v-model="statistic.number[item.index]"
                        disabled
                        placeholder="Название"
                      />
                    </a-form-model-item>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="container_xl app-container"
            v-if="$route.hash == '#sessions_tariffs'"
          >
            <div class="card_block px-4 py-4 mt-0" v-if="checkAccess('tariffs', 'get')">
              <FormTitle title="Тарифы" />
              <div class="tariff-card-grid">
                <TariffCard
                  v-for="tariff in form.tariffs"
                  :tariff="tariff"
                  :reloadTariff="reloadTariff"
                  :key="tariff.id"
                />
              </div>
              <div
                class="create-inner-variant"
                @click="addGroup"
                v-if="checkAccess('tariffs', 'post')"
              >
                <span> </span>
                Добавить
              </div>
            </div>
          </div>
          <div
            class="container_xl app-container d-flex flex-column"
            v-if="$route.hash == '#sessions_tariffs'"
          >
            <div class="form_tab">
              <div>
                <span
                  v-for="(item, index) in formTabData"
                  :key="index"
                  @click="formTab.sub_service = item.index"
                  :class="{ 'avtive-formTab': formTab.sub_service == item.index }"
                >
                  {{ item.label }}
                </span>
              </div>
            </div>
            <div
              class="card_block px-4 py-4 mt-0 border-left-radius"
              v-for="(item, index) in formTabData"
              :key="index"
              v-if="formTab.sub_service == item.index"
            >
              <FormTitle title=" Цены на дополнительные услуги" />
              <div
                class="d-flex align-items-center"
                v-for="service in form.additional_services"
                :key="service.indexId"
              >
                <div class="grid-2 mb-4 w-100">
                  <a-form-model-item class="form-item mb-0" label="Дополнительные услуги">
                    <a-input
                      v-model="service.name[item.index]"
                      placeholder="Дополнительный сервис..."
                      disabled
                    />
                  </a-form-model-item>
                  <a-form-model-item class="form-item mb-0" label="Цена услуг">
                    <a-input
                      :max-length="8"
                      v-model="service.price"
                      placeholder="Service price"
                      disabled
                    />
                  </a-form-model-item>
                </div>
                <!-- <div
                class="variant-btn variant-btn-delete mt-3 mx-2"
                v-html="xIcon"
                @click="deleteServices(service.indexId)"
              ></div> -->
              </div>
              <!-- <div class="create-inner-variant mt-0" @click="addServices">
              <span v-html="plusIcon"> </span>
              Добавить
            </div> -->
            </div>
          </div>
          <div
            class="container_xl app-container d-flex flex-column"
            v-if="$route.hash == '#faq'"
          >
            <div class="form_tab">
              <div>
                <span
                  v-for="(item, index) in formTabData"
                  :key="index"
                  @click="formTab.faq = item.index"
                  :class="{ 'avtive-formTab': formTab.faq == item.index }"
                >
                  {{ item.label }}
                </span>
              </div>
            </div>
            <div
              class="card_block px-4 py-4 mt-0 border-left-radius main-table"
              v-for="(item, index) in formTabData"
              :key="index"
              v-if="formTab.faq == item.index"
            >
              <FormTitle title="Добавить частые вопросы" />
              <!-- <div v-for="faq in form.faqs" :key="faq.indexId" class="faqs-grid">
              <div class="d-flex align-items-center">
                <a-form-model-item class="form-item w-100" label="Savol yozish">
                  <a-input
                    v-model="faq.question[item.index]"
                    placeholder="Question"
                    disabled
                  />
                </a-form-model-item>

         
              </div>
              <a-form-model-item class="form-item mb-0" label="Javob yozish">
                <quill-editor
                  class="product-editor mt-1"
                  disabled
                  :options="editorOption"
                  v-model="faq.answer[item.index]"
                />
              </a-form-model-item>
            </div> -->
              <a-table :columns="columns" :pagination="false" :data-source="form.faqs">
                <span slot="indexId" slot-scope="text">#{{ text.indexId }}</span>
                <span
                  slot="answer"
                  slot-scope="text"
                  v-html="text?.ru ? text?.ru : '-----'"
                ></span>
                <span slot="question" slot-scope="text">
                  <span>{{ text?.ru ? text?.ru : "-----" }}</span>
                </span>

                <span slot="id" slot-scope="text">
                  <span class="action-btn" v-html="editIcon"> </span>

                  <span class="action-btn" v-html="deleteIcon"> </span>
                </span>
              </a-table>
              <!-- <div class="create-inner-variant" @click="addFaqs">
              <span v-html="plusIcon"> </span>
              Добавить
            </div> -->
            </div>
          </div>
          <!-- <div
          class="container_xl app-container d-flex flex-column"
          v-if="$route.hash == '' || $route.hash == '#total_info'"
        >
          <div class="form_tab">
            <div>
              <span
                v-for="(item, index) in formTabData"
                :key="index"
                @click="formTab.package = item.index"
                :class="{ 'avtive-formTab': formTab.package == item.index }"
              >
                {{ item.label }}
              </span>
            </div>
          </div>
          <div
            class="card_block px-4 py-4 mt-0 border-left-radius"
            v-for="(item, index) in formTabData"
            :key="index"
            v-if="formTab.package == item.index"
          >
            <FormTitle title="Варианты пакетов" />
            <span
              class="faqs-grid position-relative"
              v-for="option in form.package_options"
              :key="option.indexId"
            >
              <a-form-model-item class="form-item mb-0 mt-0">
                <quill-editor
                  class="product-editor mt-0 padding-editor"
                  :options="editorOption"
                  disabled
                  v-model="option.desc[item.index]"
                />
              </a-form-model-item>
            </span>
          </div>
        </div> -->
          <div
            class="container_xl app-container d-flex flex-column"
            v-if="$route.hash == '#reviews'"
          >
            <div class="form_tab">
              <div>
                <span
                  v-for="(item, index) in formTabData"
                  :key="index"
                  @click="formTab.feedback = item.index"
                  :class="{ 'avtive-formTab': formTab.feedback == item.index }"
                >
                  {{ item.label }}
                </span>
              </div>
            </div>
            <div
              class="card_block px-4 py-4 mt-0 border-left-radius"
              v-for="(item, index) in formTabData"
              :key="index"
              v-if="formTab.feedback == item.index"
            >
              <div class="d-flex justify-content-between">
                <FormTitle title="Отзывы" />
              </div>
              <div
                class="grid-with-img faqs-grid"
                v-for="(feedback, i) in form.feedbacks"
                :key="feedback.indexId"
              >
                <div>
                  <div class="grid-with-btn">
                    <a-form-model-item class="form-item mb-3" label="Пользователь">
                      <a-input
                        v-model="feedback.name[item.index]"
                        disabled
                        placeholder="Пользователь..."
                      />
                    </a-form-model-item>
                    <!-- <a-form-model-item class="form-item mb-3" label="Brend">
                    <a-input
                      v-model="feedback.feedback[item.index]"
                      placeholder="Brand"
                    />
                  </a-form-model-item> -->
                    <!-- <div class="d-flex align-items-center">
                    <div
                      @click="deleteFeedbacks(feedback.indexId)"
                      class="variant-btn variant-btn-delete mt-3"
                      v-html="xIcon"
                    ></div>
                  </div> -->
                  </div>
                  <a-form-model-item class="form-item mb-0 mt-0" label="Текст">
                    <a-input
                      type="textarea"
                      disabled
                      v-model="feedback.feedback[item.index]"
                      rows="6"
                      placeholder="Текст..."
                    />
                  </a-form-model-item>
                </div>
                <div class="clearfix">
                  <a-upload
                    action="https://api.safarpark.uz/api/files/upload"
                    list-type="picture-card"
                    :disabled="true"
                    :headers="headers"
                    :file-list="feedback.feedbacksFile"
                    @preview="handlePreview"
                    @change="($event) => handleChangeComment($event, feedback.indexId)"
                  >
                    <div v-if="feedback.feedbacksFile.length < 1">
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
              </div>
              <!-- <div class="create-inner-variant" @click="addFeedbacks">
              <span v-html="plusIcon"> </span>
              Добавить
            </div> -->
            </div>
          </div>
          <div class="container_xl d-flex justify-content-end">
            <a-button
              class="add-btn add-header-btn btn-primary d-flex align-items-center"
              type="danger"
              @click="showDeleteConfirm(visible)"
              v-if="checkAccess('services', 'delete')"
            >
              Удалить услугу
            </a-button>
          </div>
        </div>
      </a-spin>
    </a-form-model>
  </div>
</template>

<script>
import TitleBlock from "../../components/Title-block.vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import FormTitle from "../../components/Form-title.vue";
import status from "../../mixins/status";
import authAccess from "../../mixins/authAccess";

import TariffCard from "../../components/cards/tariffCard.vue";
const columns = [
  {
    title: "№",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "indexId" },
    className: "column-service",
    align: "left",
    width: 50,
  },
  {
    title: "вопрос",
    dataIndex: "question",
    key: "question",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "question" },
    className: "column-name",
    align: "left",
    width: "45%",
  },
  {
    title: "ответ",
    dataIndex: "answer",
    key: "answer",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "answer" },
    className: "column-service",
  },
  {
    title: "ДЕЙСТВИЯ",
    className: "column-btns",
    dataIndex: "indexId",
    key: "indexId",
    align: "right",
    scopedSlots: { customRender: "id" },
    width: 100,
  },
];
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export default {
  name: "IndexPage",
  head: {
    title: "Услуги",
  },
  mixins: [status, authAccess],
  data() {
    return {
      delayTime: 0,
      spinning: false,
      columns,
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      service: [],
      xIcon: require("../../assets/svg/x.svg?raw"),
      plusIcon: require("../../assets/svg/plus.svg?raw"),
      infoIcon: require("../../assets/svg/info.svg?raw"),
      addIcon: require("../../assets/svg/add-icon.svg?raw"),
      editIcon: require("../../assets/svg/edit.svg?raw"),
      deleteIcon: require("../../assets/svg/delete.svg?raw"),
      formTab: {
        name: "ru",
        guarantee: "ru",
        sub_service: "ru",
        faq: "ru",
        package: "ru",
        feedback: "ru",
      },
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
      fileBanner: [],
      fileForCard: [],
      fileGalleries: [],
      form: {
        name: {
          ru: "",
          uz: "",
        },
        desc: {
          ru: "",
          uz: "",
        },
        guarantee: {
          ru: "",
          uz: "",
        },
        banner: null,
        for_card: null,
        galleries: [],
        statistics: [
          {
            indexId: 1,
            name: {
              ru: "",
              uz: "",
            },
            number: {
              ru: "",
              uz: "",
            },
            img: "",
            statisticFile: [],
          },
          {
            indexId: 2,
            name: {
              ru: "",
              uz: "",
            },
            number: {
              ru: "",
              uz: "",
            },
            img: "",
            statisticFile: [],
          },
          {
            indexId: 3,
            name: {
              ru: "",
              uz: "",
            },
            number: {
              ru: "",
              uz: "",
            },
            img: "",
            statisticFile: [],
          },
        ],
        additional_services: [
          {
            indexId: 1,
            name: {
              ru: "",
              uz: "",
            },
            price: 0,
          },
        ],
        faqs: [],
        package_options: [
          {
            indexId: 1,
            desc: {
              ru: "",
              uz: "",
            },
          },
        ],
        feedbacks: [
          {
            indexId: 1,
            name: {
              ru: "",
              uz: "",
            },
            feedback: {
              ru: "",
              uz: "",
            },
            logo: "",
            feedbacksFile: [],
          },
        ],
      },
      rules: {
        feedbacks: [
          {
            name: {
              ru: [
                {
                  required: true,
                  message: "Please input Activity name",
                  trigger: "change",
                },
              ],
            },
          },
        ],
        name: {
          ru: [
            { required: true, message: "Please input Activity name", trigger: "change" },
          ],
        },
        region: [
          { required: true, message: "Please select Activity zone", trigger: "change" },
        ],
        date1: [{ required: true, message: "Please pick a date", trigger: "change" }],
        type: [
          {
            type: "array",
            required: true,
            message: "Please select at least one activity type",
            trigger: "change",
          },
        ],
        resource: [
          {
            required: true,
            message: "Please select activity resource",
            trigger: "change",
          },
        ],
        desc: [
          { required: true, message: "Please input activity form", trigger: "blur" },
        ],
      },
      previewVisible: false,
      previewImage: "",
      fileList: [
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url:
            "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        },
      ],
    };
  },
  methods: {
    onSubmit() {
      const data = {
        ...this.form,
        statistics: this.form.statistics
          .filter((elem) => elem.name.ru || elem.number.ru)
          .map((item) => {
            const { statisticFile, indexId, ...rest } = item;
            return rest;
          }),
        feedbacks: this.form.feedbacks.map((item) => {
          const { feedbacksFile, indexId, ...rest } = item;
          return rest;
        }),
      };
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.__EDIT_SERVICES(data);
        } else {
          return false;
        }
      });
    },
    showDeleteConfirm(val) {
      this.$confirm({
        title: "Вы уверены, что удалили эту услугу?",
        okText: "Да",
        okType: "danger",
        cancelText: "Нет",
        onOk: () => {
          this.deleteService();
        },
        onCancel() {},
      });
    },

    async __EDIT_SERVICES(data) {
      try {
        await this.$store.dispatch("fetchServices/editServices", {
          id: this.$route.params.index,
          data: data,
        });
        this.notification("success", "success", "Услуга успешно добавлен");
        this.$router.push("/");
      } catch (e) {
        this.statusFunc(e);
      }
    },
    deleteService() {
      this.__DELETE_SERVICES(this.$route.params.index);
    },
    async __DELETE_SERVICES(id) {
      try {
        await this.$store.dispatch("fetchServices/deleteServices", id);
        this.$router.push("/");
        this.notification("success", "success", "Услуга успешно удален");
      } catch (e) {
        this.statusFunc(e);
      }
    },
    async __GET_SERVICES_BY_ID() {
      this.spinning = true;
      const data = await this.$store.dispatch(
        "fetchServices/getServicesById",
        this.$route.params.index
      );
      this.form = {
        ...data?.service,
        statistics: data?.service.statistics.map((item, index) => {
          return {
            ...item,
            indexId: item.id,
            img: item?.sm_img ? item?.sm_img : "",
            statisticFile: item?.sm_img
              ? [
                  {
                    uid: "-1",
                    name: "image.png",
                    status: "done",
                    oldImg: true,
                    url: item?.sm_img,
                  },
                ]
              : [],
          };
        }),
        moments: data?.service.moments.map((item, index) => {
          return {
            indexId: index,
            id: item.id,
            title: item.title,
          };
        }),
        cards: data?.service.cards.map((item, index) => {
          return {
            indexId: item.id,
            id: item.id,
            name: item.name,
            img: item?.sm_img ? item?.sm_img : "",
            imgList: item?.sm_img
              ? [
                  {
                    uid: "-1",
                    name: "image.png",
                    status: "done",
                    oldImg: true,
                    url: item?.sm_img,
                  },
                ]
              : [],
          };
        }),
        additional_services: data?.service.additional_services.map((item, index) => {
          return {
            ...item,
            indexId: item.id,
          };
        }),
        faqs: data?.service.faqs.map((item, index) => {
          return {
            ...item,
            indexId: item.id,
            key: item.id,
          };
        }),
        package_options: data?.service.package_options.map((item, index) => {
          return {
            ...item,
            indexId: item.id,
          };
        }),
        feedbacks: data?.service.feedbacks.map((item, index) => {
          return {
            ...item,
            indexId: item.id,
            logo: item.sm_logo,
            feedbacksFile: item?.sm_logo
              ? [
                  {
                    uid: "-1",
                    name: "image.png",
                    status: "done",
                    oldImg: true,
                    url: item?.sm_logo,
                  },
                ]
              : [],
          };
        }),
        galleries: data?.service?.gallery?.files,
      };
      data?.service.gallery?.sm_files.forEach((item, index) => {
        data?.service.gallery?.files.forEach((elem, ind) => {
          if (index == ind) {
            this.fileGalleries.push({
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
      this.fileForCard = this.form.for_card
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              oldImg: true,
              url: this.form.sm_for_card,
            },
          ]
        : [];
      this.fileBanner = this.form.banner
        ? [
            {
              uid: "-1",
              name: "image.png",
              status: "done",
              oldImg: true,
              url: this.form.sm_banner,
            },
          ]
        : [];
      const statLength = this.form.statistics.length;
      for (var i = 0; i < 3 - statLength; i++) {
        this.form.statistics.push({
          indexId: this.form.statistics.length + i + 1,
          id: 0,
          name: {
            ru: "",
            uz: "",
          },
          number: {
            ru: "",
            uz: "",
          },
          img: "",
          statisticFile: [],
        });
      }
      const cardsLength = this.form.cards.length;
      for (var i = 0; i < 3 - cardsLength; i++) {
        this.form.cards.push({
          indexId: this.form.cards.length + i + 1,
          id: 0,
          name: {
            ru: "",
            uz: "",
          },
          img: "",
          imgList: [],
        });
      }
      this.spinning = false;
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
    handleChangeComment({ fileList }, id) {
      const feed = this.form.feedbacks.find((item) => item.indexId == id);
      feed.feedbacksFile = fileList;
      if (fileList[0]?.response?.path) {
        feed.logo = fileList[0]?.response?.path;
      } else if (fileList.length == 0) {
        feed.logo = "";
      }
    },
    handleChangeStatistic({ fileList }, id) {
      const stat = this.form.statistics.find((item) => item.indexId == id);
      stat.statisticFile = fileList;
      if (fileList[0]?.response?.path) stat.img = fileList[0]?.response?.path;
    },
    handleChangeServiceUpload({ fileList }, name) {
      name == "banner" ? (this.fileBanner = fileList) : (this.fileForCard = fileList);
      if (fileList[0]?.response?.path) {
        this.form[name] = fileList[0]?.response?.path;
      } else if (fileList.length == 0) {
        this.form[name] = null;
      }
    },
    handleChangeCards({ fileList }, id) {
      const stat = this.form.cards.find((item) => item.indexId == id);
      stat.imgList = fileList;
      if (fileList[0]?.response?.path) {
        stat.img = fileList[0]?.response?.path;
      } else if (fileList.length == 0) {
        stat.img = null;
      }
    },
    handleChangeGalleriesUpload({ fileList }) {
      this.fileGalleries = fileList;
      if (fileList[0]?.response?.path) {
        this.form.galleries = fileList.map((item) => item?.response?.path);
      } else if (fileList.length == 0 || this.form.galleries > fileList.length) {
        this.form.galleries = fileList.map((item) => item?.response?.path);
      }
    },
    addGroup() {
      this.$router.push(`/add_tariff/${this.$route.params.index}`);
      localStorage.setItem(
        "serive_params",
        JSON.stringify({
          name: this.$route.name,
          params: this.$route.params,
          hash: this.$route.hash,
        })
      );
    },
    reloadTariff() {
      this.__GET_SERVICES_BY_ID();
    },
  },
  async mounted() {
    await this.__GET_SERVICES_BY_ID();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  },
  components: { TitleBlock, FormTitle, TariffCard },
};
</script>
<style lang="css">
@import "../../assets/css/pages/services.css";
@import "../../assets/css/pages/tariff.css";
</style>
