<template>
  <div class="pb">
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
          @click="onSubmit"
          v-if="checkAccess('services', 'post')"
        >
          <span class="svg-icon"> </span>
          Добавить
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
      <div class="services-grid pb-5 pt-5">
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
            <a-form-model-item
              class="form-item mb-3"
              label="Название сервиса"
              :prop="item.index == 'ru' ? 'name.ru' : ''"
            >
              <a-input
                v-model="form.name[item.index]"
                placeholder="Название сервиса..."
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
                placeholder="Краткая информация о сервисе..."
              />
            </a-form-model-item>
            <div class="service-upload-container">
              <a-form-model-item class="form-item mb-3 mt-3" label="Баннер">
                <div class="service-upload">
                  <a-upload
                    action="https://api.safarpark.uz/api/files/upload"
                    list-type="picture-card"
                    :headers="headers"
                    :file-list="fileBanner"
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
                    :headers="headers"
                    :file-list="fileForCard"
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
                  :file-list="fileGalleries"
                  @preview="handlePreview"
                  @change="($event) => handleChangeGalleriesUpload($event, 'banner')"
                >
                  <div v-if="fileGalleries.length < 50">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">Загрузить</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
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
            <a-form-model-item
              class="form-item mb-0"
              label="Основные моменты"
            ></a-form-model-item>
            <div
              class="grid-with-btn"
              v-for="(moment, index) in form.moments"
              :key="moment.indexId"
            >
              <a-form-model-item class="form-item mb-3">
                <a-input v-model="moment.title[item.index]" placeholder="Текст" />
              </a-form-model-item>
              <div class="d-flex align-items-start">
                <div
                  class="variant-btn variant-btn-delete"
                  v-html="xIcon"
                  @click="deleteMoments(moment.indexId)"
                ></div>
              </div>
            </div>
            <div class="create-inner-variant mt-4" @click="addMoments">
              <span v-html="plusIcon"> </span>
              Добавить
            </div>
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
                :options="editorOption"
              />
            </a-form-model-item>
            <div class="mt-3 statistic-grid">
              <div v-for="statistic in form.statistics" class="d-flex">
                <div class="clearfix">
                  <a-upload
                    action="https://api.safarpark.uz/api/files/upload"
                    list-type="picture-card"
                    :headers="headers"
                    :file-list="statistic.statisticFile"
                    @preview="handlePreview"
                    @change="($event) => handleChangeStatistic($event, statistic.indexId)"
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
                      placeholder="Число"
                    />
                  </a-form-model-item>
                  <a-form-model-item class="form-item mb-3">
                    <a-input
                      v-model="statistic.number[item.index]"
                      placeholder="Название"
                    />
                  </a-form-model-item>
                </div>
              </div>
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
                    :rules="[{ required: true, message: 'Please select your gender!' }]"
                  />
                </a-form-model-item>
                <a-form-model-item class="form-item mb-0" label="Цена услуг">
                  <a-input
                    :max-length="8"
                    :value="service.price"
                    v-model="service.price"
                    placeholder="Service price"
                  />
                </a-form-model-item>
              </div>
              <div
                class="variant-btn variant-btn-delete mt-3 mx-2"
                v-html="xIcon"
                @click="deleteServices(service.indexId)"
              ></div>
            </div>
            <div class="create-inner-variant mt-0" @click="addServices">
              <span v-html="plusIcon"> </span>
              Добавить
            </div>
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
                  <a-input v-model="faq.question[item.index]" placeholder="Question" />
                </a-form-model-item>
                <div
                  @click="deleteFaqs(faq.indexId)"
                  class="variant-btn variant-btn-delete mt-3 mx-2"
                  v-html="xIcon"
                ></div>
              </div>
              <a-form-model-item class="form-item mb-0" label="Javob yozish">
                <quill-editor
                  class="product-editor mt-1"
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
                <span class="action-btn" v-html="editIcon" @click="editFaqs(text)">
                </span>
                <a-popconfirm
                  title="Are you sure delete this row?"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="deleteFaqs(text)"
                >
                  <span class="action-btn" v-html="deleteIcon"> </span>
                </a-popconfirm>
              </span>
            </a-table>
            <div class="create-inner-variant" @click="addFaqs">
              <span v-html="plusIcon"> </span>
              Добавить
            </div>
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
              <div
                @click="deletePackageOption(option.indexId)"
                class="variant-btn variant-btn-delete mt-3"
                style="position: absolute; right: 5px; top: -10px; z-index: 9"
                v-html="xIcon"
              ></div>
              <a-form-model-item class="form-item mb-0 mt-0">
                <quill-editor
                  class="product-editor mt-0 padding-editor"
                  :options="editorOption"
                  v-model="option.desc[item.index]"
                />
              </a-form-model-item>
            </span>
            <div class="create-inner-variant" @click="addPackageOption">
              <span v-html="plusIcon"> </span>
            Добавить
            </div>
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
                    <a-input v-model="feedback.name[item.index]" placeholder="Пользователь..." />
                  </a-form-model-item>
                  <div class="d-flex align-items-center">
                    <div
                      @click="deleteFeedbacks(feedback.indexId)"
                      class="variant-btn variant-btn-delete mt-3"
                      v-html="xIcon"
                    ></div>
                  </div>
                </div>
                <a-form-model-item class="form-item mb-0 mt-0" label="Текст">
                  <a-input type="textarea" rows="6" placeholder="Текст..." />
                </a-form-model-item>
              </div>
              <div class="clearfix">
                <a-upload
                  action="https://api.safarpark.uz/api/files/upload"
                  list-type="picture-card"
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
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </div>
            </div>
            <div class="create-inner-variant" @click="addFeedbacks">
              <span v-html="plusIcon"> </span>
              Добавить
            </div>
          </div>
        </div>
      </div>
    </a-form-model>
    <a-modal
      v-model="visible"
      :dialog-style="{ top: '50px' }"
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
            @click="formTabModal = item.index"
            :class="{ 'avtive-formTabModal': formTabModal == item.index }"
          >
            {{ item.label }}
          </span>
        </div>
        <div
          class="d-flex flex-column"
          v-for="(item, index) in formTabData"
          :key="index"
          v-if="formTabModal == item.index"
        >
          <a-form-model
            :model="formFaq"
            ref="ruleFormFaq"
            :rules="rules"
            layout="vertical"
          >
            <a-form-model-item class="form-item mb-3" label="Вопрос" prop="question.ru">
              <a-input
                type="textarea"
                rows="5"
                v-model="formFaq.question[item.index]"
                placeholder="Вопрос"
              />
            </a-form-model-item>
            <a-form-model-item class="form-item mb-3" label="Ответ" prop="answer.ru">
              <!-- <a-input
                type="textarea"
                rows="5"
                v-model="formFaq.answer[item.index]"
                placeholder="Ответ"
              /> -->
              <quill-editor
                v-model="formFaq.answer[item.index]"
                class="product-editor mt-1"
                :options="editorOption"
                placeholder="Ответ"
              />
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
            <span class="svg-icon" v-html="addIcon"></span>
            Сохранять
          </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import TitleBlock from "../components/Title-block.vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import FormTitle from "../components/Form-title.vue";
import status from "../mixins/status";
import authAccess from "../mixins/authAccess";

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
      title: "Добавить",
      formTabModal: "ru",
      formFaq: {
        question: {
          ru: "",
          uz: "",
        },
        answer: {
          ru: "",
          uz: "",
        },
      },
      visible: false,
      columns,
      statistic: {
        info: [
          {
            img: "",
            name: {
              ru: "",
              uz: "",
            },
            number: {
              ru: "",
              uz: "",
            },
          },
          {
            img: "",
            name: {
              ru: "",
              uz: "",
            },
            number: {
              ru: "",
              uz: "",
            },
          },
          {
            img: "",
            name: {
              ru: "",
              uz: "",
            },
            number: {
              ru: "",
              uz: "",
            },
          },
        ],
        info: [
          {
            name: {
              ru: "",
              uz: "",
            },
          },
          {
            name: {
              ru: "",
              uz: "",
            },
          },
          {
            name: {
              ru: "",
              uz: "",
            },
          },
        ],
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      xIcon: require("../assets/svg/x.svg?raw"),
      plusIcon: require("../assets/svg/plus.svg?raw"),
      infoIcon: require("../assets/svg/info.svg?raw"),
      editIcon: require("../assets/svg/edit.svg?raw"),
      deleteIcon: require("../assets/svg/delete.svg?raw"),
      addIcon: require("../assets/svg/add-icon.svg?raw"),
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
        moments: [
          {
            indexId: 1,
            title: {
              ru: "",
              uz: "",
            },
          },
        ],
        cards: [
          {
            indexId: 1,
            name: {
              ru: "",
              uz: "",
            },
            imgList: [],
            img: "",
          },
          {
            indexId: 2,
            name: {
              ru: "",
              uz: "",
            },
            imgList: [],
            img: "",
          },
          {
            indexId: 3,
            name: {
              ru: "",
              uz: "",
            },
            imgList: [],
            img: "",
          },
        ],
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
        additional_services: [
          {
            name: {
              ru: [
                {
                  required: true,
                  message: "This field is required",
                  trigger: "change",
                },
              ],
            },
          },
        ],
        feedbacks: [
          {
            name: {
              ru: [
                {
                  required: true,
                  message: "This field is required",
                  trigger: "change",
                },
              ],
            },
          },
        ],
        name: {
          ru: [{ required: true, message: "This field is required", trigger: "change" }],
        },
        type: [
          {
            type: "array",
            required: true,
            message: "Please select at least one activity type",
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
      value: "",
    };
  },
  methods: {
    handleOk() {
      this.visible = false;
    },
    onSubmit() {
      const data = {
        ...this.form,
        statistics: this.form.statistics
          .filter((elem) => elem.name.ru || elem.number.ru)
          .map((item) => {
            const { statisticFile, indexId, ...rest } = item;
            return rest;
          }),
        cards: this.form.cards
          .filter((elem) => elem.name.ru)
          .map((item) => {
            const { imgList, indexId, ...rest } = item;
            return rest;
          }),
        moments: this.form.moments
          .filter((elem) => elem.title.ru)
          .map((item) => {
            const { indexId, ...rest } = item;
            return rest;
          }),
        feedbacks: this.form.feedbacks
          .map((item) => {
            const { feedbacksFile, indexId, ...rest } = item;
            return rest;
          })
          .filter((elem) => elem.name.ru),
        additional_services: this.form.additional_services.filter(
          (item) => item.price && item.name.ru
        ),
        faqs: this.form.faqs.filter((elem) => elem.question.ru && elem.answer.ru),
        package_options: this.form.package_options.filter((elem) => elem.desc.ru),
      };

      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.__POST_SERVICES(data);
        } else {
          return false;
        }
      });
    },
    changeHash() {},
    async __POST_SERVICES(data) {
      try {
        await this.$store.dispatch("fetchServices/postServices", data);
        this.notification("success", "success", "Услуга успешно добавлен");
        this.$router.push("/");
      } catch (e) {
        this.statusFunc(e);
      }
    },
    async __GET_SERVICES() {
      this.servies = this.$store.dispatch("fetchServices/getServices");
    },
    editFaqs(indexId) {
      this.visible = true;
      this.faqId = indexId;
      const faq = this.form.faqs.find((item) => item.indexId == indexId);
      this.formFaq = { ...faq };
    },
    deleteFaqs(indexId) {
      this.form.faqs = this.form.faqs.filter((item) => item.indexId != indexId);
    },
    deleteFeedbacks(indexId) {
      if (this.form.feedbacks.length > 1)
        this.form.feedbacks = this.form.feedbacks.filter(
          (item) => item.indexId != indexId
        );
    },
    deleteServices(indexId) {
      if (this.form.additional_services.length > 1)
        this.form.additional_services = this.form.additional_services.filter(
          (item) => item.indexId != indexId
        );
    },
    deleteMoments(indexId) {
      if (this.form.moments.length > 1)
        this.form.moments = this.form.moments.filter((item) => item.indexId != indexId);
    },
    deletePackageOption(indexId) {
      if (this.form.package_options.length > 1)
        this.form.package_options = this.form.package_options.filter(
          (item) => item.indexId != indexId
        );
    },
    addPackageOption() {
      this.form.package_options.push({
        desc: {
          ru: "",
          uz: "",
        },
        indexId: Math.max(...this.form.package_options.map((o) => o.indexId)) + 1,
      });
    },
    saveData() {
      this.visible = false;
      if (this.faqId) {
        let faq = this.form.faqs.find((item) => item.indexId == this.faqId);
        faq = { ...this.formFaq, indexId: this.faqId };
        this.faqId = "";
      } else {
        this.form.faqs.push({
          ...this.formFaq,
          indexId:
            this.form.faqs.length > 0
              ? Math.max(...this.form.faqs.map((o) => o.indexId)) + 1
              : 1,
          key:
            this.form.faqs.length > 0
              ? Math.max(...this.form.faqs.map((o) => o.indexId)) + 1
              : 1,
        });
      }
    },
    addFaqs() {
      this.visible = true;
    },
    addFeedbacks() {
      this.form.feedbacks.push({
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
        indexId: Math.max(...this.form.feedbacks.map((o) => o.indexId)) + 1,
      });
    },
    addServices() {
      this.form.additional_services.push({
        name: {
          ru: "",
          uz: "",
        },
        price: 0,
        indexId: Math.max(...this.form.additional_services.map((o) => o.indexId)) + 1,
      });
    },
    addMoments() {
      this.form.moments.push({
        title: {
          ru: "",
          uz: "",
        },
        indexId: Math.max(...this.form.moments.map((o) => o.indexId)) + 1,
      });
    },
    addGroup() {
      this.$router.push("add_services");
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
        feed.logo = null;
      }
    },
    handleChangeStatistic({ fileList }, id) {
      const stat = this.form.statistics.find((item) => item.indexId == id);
      stat.statisticFile = fileList;
      if (fileList[0]?.response?.path) {
        stat.img = fileList[0]?.response?.path;
      } else if (fileList.length == 0) {
        stat.img = null;
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
    handleChangeServiceUpload({ fileList }, name) {
      name == "banner" ? (this.fileBanner = fileList) : (this.fileForCard = fileList);
      if (fileList[0]?.response?.path) {
        this.form[name] = fileList[0]?.response?.path;
      } else if (fileList.length == 0) {
        this.form[name] = null;
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
  },
  mounted() {
    this.__GET_SERVICES();
  },
  watch: {
    visible(val) {
      if (!val) {
        this.formTabModal = "ru";
        this.formFaq = {
          question: {
            ru: "",
            uz: "",
          },
          answer: {
            ru: "",
            uz: "",
          },
        };
      }
    },
  },
  components: { TitleBlock, FormTitle },
};
</script>
<style lang="css">
@import "../assets/css/pages/services.css";
</style>
