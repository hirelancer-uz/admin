<template>
  <div class="">
    <a-form-model
      :model="form"
      ref="ruleForm"
      :rules="rules"
      layout="vertical"
      :wrapper-col="wrapperCol"
    >
      <TitleBlock title="Тарифы" :breadbrumb="['Главный']" lastLink="Тарифы">
        <div class="d-flex">
          <div
            class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
            @click="
              $router.push({
                name: 'edit_park_services',
                params: { index: service_id },
                hash: '#sessions_tariffs',
              })
            "
          >
            Отмена
          </div>
          <a-button
            class="add-btn add-header-btn btn-primary d-flex align-items-center"
            type="primary"
            @click="onSubmit"
            v-if="checkAccess('tariffs', 'put')"
          >
            <span class="svg-icon"> </span>
            Сохранять
          </a-button>
        </div>
      </TitleBlock>
      <a-spin :spinning="spinning" :delay="delayTime">
        <div class="services-grid pb-5 pt-5">
          <div class="container_xl app-container d-flex flex-column">
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
              <div class="grid-2">
                <a-form-model-item
                  class="form-item mb-3 required"
                  label="Название"
                  prop="name.ru"
                >
                  <a-input v-model="form.name[item.index]" placeholder="Название..." />
                </a-form-model-item>
                <a-form-model-item class="form-item mb-3 required" label="Подзаголовок">
                  <a-input
                    v-model="form.subtitle[item.index]"
                    placeholder="Подзаголовок..."
                  />
                </a-form-model-item>
              </div>
              <a-form-model-item class="form-item mb-3" label="Описание">
                <quill-editor
                  class="product-editor"
                  :options="editorOption"
                  v-model="form.desc[item.index]"
                />
              </a-form-model-item>
            </div>
          </div>
          <div class="container_xl app-container">
            <div class="card_block mt-4 service-table px-4 py-3">
              <a-table :columns="columns" :pagination="false" :data-source="data">
                <span slot="customTitle"><a-icon type="smile-o" /> Name</span>a
                <span slot="time" slot-scope="text">
                  <div class="d-flex flex-wrap">
                    <span
                      class="time_picker"
                      style="margin-right: 16px"
                      v-for="(timePicker, ind) in form.schedule[text - 1]"
                      :class="{ disabledTime: timePicker.disabled }"
                    >
                      <span
                        @click="deleteTimePicker(text - 1, timePicker.id)"
                        class="delete-time-picker"
                        v-html="xIcon"
                      ></span>
                      <input
                        v-model="timePicker.start"
                        type="time"
                        id="time-input"
                        name="time"
                        min="00:00"
                        max="23:59"
                        :class="{ disabledTime: timePicker.disabled }"
                        :disabled="timePicker.disabled"
                        pattern="[0-2][0-9]:[0-5][0-9]"
                      />
                      <span
                        class="d-flex align-items-center"
                        style="margin-left: 3px; margin-right: 3px"
                        >-</span
                      >
                      <input
                        v-model="timePicker.end"
                        type="time"
                        :class="{ disabledTime: timePicker.disabled }"
                        :disabled="timePicker.disabled"
                        id="time-input"
                        name="time"
                        min="00:00"
                        max="23:59"
                        pattern="[0-2][0-9]:[0-5][0-9]"
                      />
                    </span>
                    <div
                      class="outline-btn time-add-btn"
                      v-if="form.schedule.length > 0"
                      :class="{ disabledTime: form.schedule[text - 1][0].disabled }"
                      @click="addTimePicker(text - 1)"
                    >
                      <span v-html="plusIcon"> </span>
                    </div>
                  </div>
                </span>
                <span slot="id" slot-scope="text">
                  <span
                    >Круглосутоно
                    <a-checkbox
                      class="mx-3"
                      v-if="form.schedule.length > 0"
                      :checked="form.schedule[text - 1][0].disabled"
                      @change="($event) => onChangeDay($event, text - 1)"
                    >
                    </a-checkbox
                  ></span>
                </span>
              </a-table>
            </div>
          </div>
          <div class="container_xl app-container mt-4 d-flex flex-column">
            <div class="form_tab">
              <div>
                <span
                  v-for="(item, index) in formTabData"
                  :key="index"
                  @click="formTab.tariff = item.index"
                  :class="{ 'avtive-formTab': formTab.tariff == item.index }"
                >
                  {{ item.label }}
                </span>
              </div>
            </div>
            <div
              class="card_block py-4 border-left-radius"
              v-for="(item, index2) in formTabData"
              :key="index2"
              v-if="formTab.tariff == item.index"
            >
              <span class="px-4"><FormTitle title="Добавить цены" /></span>
              <div class="grid-3 px-4">
                <a-form-model-item class="form-item mb-3" label="Тип">
                  <a-select
                    :default-value="services[0].value"
                    v-model="form.type"
                    @change="changeTariff"
                  >
                    <a-select-option
                      v-for="(service, index) in services"
                      :key="service.value"
                    >
                      {{ service.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <span v-if="form.type == 'by_count'">
                  <a-form-model-item
                    class="form-item inner mb-3"
                    label="Мин. кол-во клиентов"
                    prop="min_clients"
                  >
                    <a-input
                      type="number"
                      v-model="form.min_clients"
                      placeholder="Мин. кол-во клиентов"
                    />
                  </a-form-model-item>
                </span>
                <a-form-model-item
                  class="form-item inner mb-3"
                  label="Мин. кол-во клиентов"
                  v-if="form.min_clients == null"
                >
                  <a-input
                    type="number"
                    :disabled="form.min_clients == null"
                    placeholder="Мин. кол-во клиентов"
                  />
                </a-form-model-item>
                <span v-if="form.type == 'by_count'">
                  <a-form-model-item
                    class="form-item inner mb-3"
                    label="Макс. кол-во клиентов"
                    prop="max_clients"
                  >
                    <a-input
                      type="number"
                      v-model="form.max_clients"
                      :disabled="form.max_clients == null"
                      placeholder="Макс. кол-во клиентов"
                    />
                  </a-form-model-item>
                </span>
                <a-form-model-item
                  class="form-item inner mb-3"
                  label="Макс. кол-во клиентов"
                  v-else
                >
                  <a-input
                    type="number"
                    :disabled="form.max_clients == null"
                    placeholder="Макс. кол-во клиентов"
                  />
                </a-form-model-item>
              </div>
              <div class="px-4 from_hr_top pt-3">
                <a-form-model-item class="form-item mb-3" v-if="form.type == 'tariff'">
                  <a-input
                    v-model="form.tab_start_text[item.index]"
                    placeholder="Введите параметр (текст)"
                  />
                </a-form-model-item>
                <div
                  v-for="(price, index) in form.prices"
                  :key="price.id"
                  v-if="form.type !== 'multi'"
                >
                  <!-- <a-form-model-item class="form-item mb-3" v-if="form.type == 'multi'">
                  <a-input v-model="price.name" placeholder="Введите параметр (текст)" />
                </a-form-model-item> -->
                  <div class="grid-3-with-2delete">
                    <a-form-model-item class="form-item mb-3">
                      <a-input
                        v-model="price.name"
                        placeholder="Введите параметр (текст)"
                      />
                    </a-form-model-item>
                    <a-form-model-item class="form-item mb-3">
                      <a-input-number
                        v-model="price.price"
                        :default-value="1000"
                        :formatter="
                          (value) => {
                            if (Number(value)) {
                              return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                            } else {
                              var num = [];
                              value.split('').forEach((item) => {
                                if (Number(item) || item == 0) {
                                  num.push(item);
                                }
                              });
                              return `${num.join('')}`.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ' '
                              );
                            }
                          }
                        "
                        placeholder="Введите сумму"
                        :parser="(value) => value.replace(/\$\s?|( *)/g, '')"
                      />
                    </a-form-model-item>

                    <div class="d-flex align-items-center mb-2">
                      <div
                        class="variant-btn variant-btn-delete"
                        v-html="xIcon"
                        @click="deletePrices(price.id)"
                      ></div>
                    </div>
                  </div>
                </div>
                <!-- <div
                v-for="(price2, index) in form.prices"
                :key="price2.id"
                v-if="form.type == 'multi'"
              >
                <div class="grid-2-with-2delete">
                  <a-form-model-item class="form-item mb-3">
                    <a-input
                      v-model="price2.name"
                      placeholder="Введите параметр (текст)"
                    />
                  </a-form-model-item>
                  <div
                    class="variant-btn variant-btn-delete"
                    v-html="xIcon"
                    @click="deletePrices(price2.id)"
                  ></div>
                </div>
                <div
                  class="grid-2-with mb-3"
                  v-for="(pr, index1) in price2.prices"
                  :key="pr.id"
                >
                  <span class="index-block">{{ index1 + 1 }}</span>
                  <a-form-model-item class="form-item mb-0">
                    <a-input-number
                      v-model="pr.name"
                      :default-value="1000"
                      :formatter="
                        (value) => {
                          if (Number(value)) {
                            return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                          } else {
                            var num = [];
                            value.split('').forEach((item) => {
                              if (Number(item) || item == 0) {
                                num.push(item);
                              }
                            });
                            return `${num.join('')}`.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              ' '
                            );
                          }
                        }
                      "
                      placeholder="Введите сумму"
                      :parser="(value) => value.replace(/\$\s?|( *)/g, '')"
                    />
                  </a-form-model-item>
                  <div class="d-flex align-items-center mb-2">
                    <div
                      class="outline-btn outline-light-blue-btn"
                      style="margin-right: 16px"
                      @click="addPrice(price2.id)"
                    >
                      <span class="d-flex" v-html="plusIcon"> </span>
                    </div>
                    <div
                      class="variant-btn variant-btn-delete"
                      v-html="xIcon"
                      @click="deletePrice(price2.id, pr.id)"
                    ></div>
                  </div>
                </div>
              </div> -->
                <div class="create-inner-variant" @click="addPrices">
                  <span v-html="plusIcon"> </span>
                  Добавить
                </div>
              </div>
            </div>
          </div>

          <div class="container_xl app-container d-flex flex-column mt-4">
            <div class="form_tab">
              <div>
                <span
                  v-for="(item, index) in formTabData"
                  :key="index"
                  @click="formTab.info = item.index"
                  :class="{ 'avtive-formTab': formTab.info == item.index }"
                >
                  {{ item.label }}
                </span>
              </div>
            </div>
            <div
              class="card_block border-left-radius px-4 py-4 mt-0"
              v-for="(item, index) in formTabData"
              :key="index"
              v-if="formTab.info == item.index"
            >
              <FormTitle title="Информация об услуге" />
              <a-form-model-item class="form-item mb-0 pb-0" label="Добавить статистику">
                <div class="mt-3 statistic-grid">
                  <div v-for="statistic in form.statistics" class="d-flex">
                    <div class="clearfix">
                      <a-upload
                        action="https://api.safarpark.uz/api/files/upload"
                        list-type="picture-card"
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
                          v-model="statistic.number[item.index]"
                          placeholder="Количество статистики"
                        />
                      </a-form-model-item>
                      <a-form-model-item class="form-item mb-3">
                        <a-input
                          v-model="statistic.name[item.index]"
                          placeholder="Название"
                        />
                      </a-form-model-item>
                    </div>
                  </div>
                </div>
              </a-form-model-item>
              <div class="clearfix">
                <a-upload
                  action="https://api.safarpark.uz/api/files/upload"
                  list-type="picture-card"
                  :file-list="form.fileListStat"
                  :headers="headers"
                  :multiple="true"
                  @preview="handlePreview"
                  @change="handleChangeStat"
                >
                  <div v-if="form.fileListStat.length < 20">
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
        </div>
      </a-spin>
    </a-form-model>
  </div>
</template>

<script>
import FormTitle from "../../components/Form-title.vue";
import TitleBlock from "../../components/Title-block.vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import moment from "moment";
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
const columns = [
  {
    title: "Календарь",
    dataIndex: "name",
    key: "name",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
    className: "column-name",
    width: "200px",
    fixed: "left",
  },
  {
    title: "Интервал",
    dataIndex: "time",
    key: "time",
    className: "column-times",
    scopedSlots: { customRender: "time" },
  },
  {
    title: "Дополнительно",
    className: "column-additional",
    key: "id",
    align: "left",
    dataIndex: "id",
    scopedSlots: { customRender: "id" },
    width: "200px",
  },
];

const data = [
  {
    key: "1",
    name: "Воскресенье",
    time: 1,
    id: 1,
    address: "mavjud",
    tags: "mavjud",
  },
  {
    key: "2",
    name: "Понедельник",
    time: 2,
    id: 2,
    address: "mavjud emas",
    tags: "mavjud",
  },
  {
    key: "3",
    name: "Вторник",
    time: 3,
    id: 3,
    address: "mavjud",
    tags: "mavjud",
  },
  {
    key: "4",
    name: "Среда",
    time: 4,
    id: 4,
    address: "mavjud",
    tags: "mavjud",
  },
  {
    key: "5",
    name: "Четверг",
    time: 5,
    id: 5,
    address: "mavjud",
    tags: "mavjud",
  },
  {
    key: "6",
    name: "Пятница",
    time: 6,
    id: 6,
    address: "mavjud",
    tags: "mavjud",
  },
  {
    key: "7",
    name: "Суббота",
    time: 7,
    id: 7,
    address: "mavjud",
    tags: "mavjud",
  },
];
export default {
  name: "IndexPage",
  head: {
    title: "Тарифы",
  },
  mixins: [status, authAccess],
  data() {
    return {
      delayTime: 0,
      spinning: false,
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      top: 10,
      moment,
      previewVisible: false,
      previewImage: "",
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
      services: [
        { name: "Tarif", value: "tariff" },
        { name: "By count", value: "by_count" },
        // { name: "By count and tarif", value: "multi" },
      ],
      count: 0,
      form: {
        name: {
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
        schedule: [],
        service_id: null,
        type: "tariff",
        min_clients: null,
        max_clients: null,
        tab_start_text: {
          ru: "",
          uz: "",
        },
        prices: [
          {
            id: 999,
            name: "",
            price: null,
          },
        ],
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
            img: null,
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
            img: null,
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
            img: null,
            statisticFile: [],
          },
        ],
        files: [],
        fileListStat: [],
      },
      bottom: 10,
      value: "",
      wrapperCol: { span: 14 },
      xIcon: require("../../assets/svg/x.svg?raw"),
      plusIcon: require("../../assets/svg/plus.svg?raw"),
      infoIcon: require("../../assets/svg/info.svg?raw"),
      editIcon: require("../../assets/svg/edit.svg?raw"),
      deleteIcon: require("../../assets/svg/delete.svg?raw"),
      data,
      formTab: {
        name: "ru",
        tariff: "ru",
        info: "ru",
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
      columns,
      rules: {
        name: {
          ru: [
            { required: true, message: "Please input Activity name", trigger: "change" },
          ],
        },
        min_clients: [
          { required: true, message: "This field is required", trigger: "blur" },
        ],
        max_clients: [
          { required: true, message: "This field is required", trigger: "blur" },
        ],
      },
    };
  },
  async mounted() {
    await this.__GET_TARIFF_BY_ID();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  },
  methods: {
    onChangeDay(e, index) {
      if (e.target.checked) {
        this.form.schedule[index] = this.form.schedule[index].map((item) => {
          return {
            ...item,
            disabled: true,
          };
        });
      } else {
        this.form.schedule[index] = this.form.schedule[index].map((item) => {
          return {
            ...item,
            disabled: false,
          };
        });
      }
      this.form.schedule = [...this.form.schedule];
    },
    onSubmit() {
      const data = {
        ...this.form,
        tab_start_text: this.form.type != "tariff" ? null : this.form.tab_start_text,
        prices: this.form.prices.map((item) => {
          return {
            name: item.name,
            price: item.price,
          };
        }),
        schedule: this.form.schedule.map((item) => {
          if (item[0].disabled != true) {
            return item.map((time) => {
              if (time.start && time.end) {
                return `${time.start}-${time.end}`;
              } else {
                return "";
              }
            });
          } else {
            return null;
          }
        }),
        statistics: this.form.statistics
          .filter((elem) => elem.name.ru || elem.number.ru)
          .map((item) => {
            const { statisticFile, indexId, ...rest } = item;
            return rest;
          }),
      };
      data.schedule = data.schedule.map((item) => {
        if (item && item[0] == "") {
          return [];
        } else {
          return item;
        }
      });
      let priceRequired = [];

      if (data.type == "by_count") {
        data.prices.forEach((item) => {
          if (item.price == null || item.price == "") priceRequired.push(item);
        });
      } else {
        data.prices.forEach((item) => {
          if (
            item.price == null ||
            item.price == "" ||
            item.name == null ||
            item.name == ""
          )
            priceRequired.push(item);
        });
      }
      const { fileListStat, ...rest } = data;
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          if (priceRequired.length == 0) {
            this.__EDIT_TARIFF(rest);
          } else {
            data.type == "by_count"
              ? this.notification("error", "Tariff", "Price is required")
              : this.notification("error", "Tariff", "Price and price text is required");
          }
        } else {
          return false;
        }
      });
    },

    addTimePicker(id) {
      this.form.schedule[id].push({
        id: Math.max(...this.form.schedule[id].map((o) => o.id)) + 1,
        start: "",
        end: "",
      });
    },
    deleteTimePicker(arrayId, id) {
      if (this.form.schedule[arrayId].length > 1) {
        this.form.schedule[arrayId] = this.form.schedule[arrayId].filter(
          (item) => item.id != id
        );
      }
      this.form.schedule = [...this.form.schedule];
    },
    changeTariff() {
      this.form.prices = [
        {
          id: 999,
          name: "",
          price: null,
        },
      ];
      if (this.form.type !== "by_count") {
        this.form.min_clients = null;
        this.form.max_clients = null;
      } else {
        this.form.min_clients = "";
        this.form.max_clients = "";
      }
      if (this.form.type == "tariff") {
        this.form.tab_start_text = {
          ru: "",
          uz: "",
        };
      }
    },
    // addPrice(id) {
    //   const price = this.form.prices.find((item) => item.id == id);
    //   price.prices.push({
    //     name: "",
    //     id: Math.max(...price.prices.map((o) => o.id)) + 1,
    //   });
    // },
    addPrices() {
      this.form.prices.push({
        name: "",
        price: null,
        id: Math.max(...this.form.prices.map((o) => o.id)) + 1,
      });
    },
    async __GET_TARIFF_BY_ID() {
      this.spinning = true;
      const data = await this.$store.dispatch(
        "fetchTariff/getTariffById",
        this.$route.params.index
      );
      this.service_id = data?.tariff.service_id;
      this.form = { ...this.form, ...data?.tariff };
      this.form.schedule = data?.tariff.schedule.map((item) => {
        if (item == null) {
          return [
            {
              id: 1,
              start: "",
              end: "",
              disabled: true,
            },
          ];
        } else if (item[0] == null) {
          return [
            {
              id: 1,
              start: "",
              end: "",
              disabled: false,
            },
          ];
        } else {
          return item.map((elem, indexId) => {
            const time = elem.split("-");
            return {
              id: indexId,
              start: time[0],
              end: time[1],
              disabled: false,
            };
          });
        }
      });
      this.form.prices = data?.tariff.prices.map((item, index) => {
        return {
          id: 999 + index,
          name: item.name,
          price: item.price,
        };
      });
      this.form.statistics = data?.tariff.statistics.map((item, index) => {
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
      });
      this.form.files = data?.tariff.galleries.map((item) => item.file);
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
      this.form.fileListStat = data?.tariff.galleries.map((item, index) => {
        return {
          uid: `-${index + 1}`,
          name: "image.png",
          status: "done",
          oldImg: true,
          url: item?.sm_file,
          response: {
            path: item.file,
          },
        };
      });
      this.spinning = false;
    },
    async __EDIT_TARIFF(data) {
      try {
        await this.$store.dispatch("fetchTariff/editTariff", {
          id: this.$route.params.index,
          data: data,
        });
        this.notification("success", "success", "Успешно добавлен");
        this.$router.push({
          name: "edit_park_services",
          params: { index: this.service_id },
          hash: "#sessions_tariffs",
        });
      } catch (e) {
        this.statusFunc(e);
      }
    },
    // deletePrice(parentId, id) {
    //   const parent = this.form.prices.find((item) => item.id == parentId);
    //   if (parent.prices.length > 1)
    //     parent.prices = parent.prices.filter((item) => item.id != id);
    // },
    deletePrices(id) {
      if (this.form.prices.length > 1)
        this.form.prices = this.form.prices.filter((item) => item.id != id);
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
    handleChangeStatistic({ fileList }, id) {
      const stat = this.form.statistics.find((item) => item.indexId == id);
      stat.statisticFile = fileList;
      if (fileList[0]?.response?.path) {
        stat.img = fileList[0]?.response?.path;
      } else if (fileList.length == 0) {
        stat.img = "";
      }
    },
    handleChangeStat({ fileList }) {
      this.form.fileListStat = fileList;
      if (fileList[0]?.response?.path) {
        this.form.files = fileList.map((item) => item?.response?.path);
      } else if (fileList.length == 0 || this.form.files > fileList.length) {
        this.form.files = fileList.map((item) => item?.response?.path);
      }
    },
  },

  watch: {
    // "form.type"(val) {
    //   this.form.prices = [
    //     {
    //       id: 999,
    //       name: "",
    //       prices: [
    //         {
    //           id: 99,
    //           name: "",
    //         },
    //       ],
    //     },
    //   ];
    //   if (val == "tariff") {
    //     this.form.min_clients = null;
    //     this.form.max_clients = null;
    //   } else {
    //     this.form.min_clients = "";
    //     this.form.max_clients = "";
    //   }
    // },
  },
  components: { TitleBlock, FormTitle },
};
</script>
<style lang="css">
@import "../../assets/css/pages/tariff.css";
</style>
