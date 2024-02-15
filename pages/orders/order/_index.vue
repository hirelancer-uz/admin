<template>
  <div class="posts">
    <TitleBlock
      :title="`Заказ №${this.$route.params.index}`"
      :breadbrumb="['Заказы']"
      :lastLink="`Заказ №${this.$route.params.index}`"
    >
      <div class="d-flex justify-content-between btn_group">
        <a-button
          tabindex="1"
          ref="myButton"
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          :type="
            $route.hash == '#total_info' || $route.hash == '' ? 'primary' : 'default'
          "
          @click="$router.push({ hash: 'total_info' })"
        >
          О заказе
        </a-button>
        <a-button
          ref="urlInput"
          tabindex="2"
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          :type="$route.hash == '#applications' ? 'primary' : 'default'"
          @click="$router.push({ hash: 'applications' })"
        >
          Заявки
        </a-button>
        <a-button
          tabindex="3"
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          :type="$route.hash == '#complaints' ? 'primary' : 'default'"
          @click="$router.push({ hash: 'complaints' })"
        >
          Жалобы
        </a-button>
        <a-button
          tabindex="4"
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          :type="$route.hash == '#history' ? 'primary' : 'default'"
          @click="$router.push({ hash: 'history' })"
        >
          История чата
        </a-button>
      </div>
      <div class="d-flex">
        <a-select v-model="filter" placeholder="Filter" style="min-width: 125px">
          <a-select-option v-for="item in [1, 2, 4]" :key="item">
            {{ item }}
          </a-select-option>
        </a-select>
        <div
          class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
          @click="$router.go(-1)"
        >
          Назад
        </div>
        <!-- <a-button
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          type="primary"
          @click="onSubmit"
          v-if="checkAccess('services', 'post')"
        >
          <span class="svg-icon"> </span>
          Добавить
        </a-button> -->
      </div>
    </TitleBlock>
    <a-form-model :model="form" ref="ruleForm" :rules="rules" layout="vertical">
      <div class="pb-5 pt-5">
        <a-spin :spinning="spinning" :delay="delayTime">
          <div class="container_xl app-container d-flex flex-column spin-content">
            <div
              class="order-grid"
              v-if="$route.hash == '#total_info' || $route.hash == ''"
            >
              <div>
                <div class="card_block main-table px-4 py-4">
                  <!-- <a-descriptions title="Данные заказа" layout="vertical">
                    <a-descriptions-item label="Название заказа">
                      Order name
                    </a-descriptions-item>
                    <a-descriptions-item label="Дата публикации">
                      24/09/2024
                    </a-descriptions-item>
                    <a-descriptions-item label="Имя продавца">
                      Google Переводчик
                    </a-descriptions-item>
                    <a-descriptions-item label="Категория">
                      Kategoriya
                    </a-descriptions-item>
                    <a-descriptions-item label="Цена"> $20.00 </a-descriptions-item>
                    <a-descriptions-item label="Срок">
                      20/08/2024 - 12/12/2024</a-descriptions-item
                    >
                  </a-descriptions> -->

                  <OrderShow :order="order" />
                </div>
              </div>

              <div>
                <div class="card_block main-table px-4 py-4">
                  <FormTitle title="Параметры" />

                  <a-form-model-item
                    class="form-item mb-3 status-style"
                    :class="classObject"
                    label="Статус"
                  >
                    <a-select v-model="statusValue" placeholder="Tags Mode">
                      <a-select-option v-for="elem in statusData" :key="elem.value">
                        {{ elem.label }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-button
                    class="py-3 add-btn btn-primary d-flex justify-content-center align-items-center"
                    style="height: 42px"
                    type="primary"
                    @click="onSubmit"
                    v-if="checkAccess('orders', 'put')"
                  >
                    Изменить статус
                  </a-button>
                </div>
              </div>
            </div>
            <div
              class="card_block main-table px-4 py-4"
              v-if="$route.hash == '#applications'"
            >
              <FormTitle title="Предложения" />
              <a-table
                :columns="columnsOrderApp"
                :data-source="order?.requests"
                :pagination="false"
                :loading="loading"
                align="center"
              >
                <span
                  to="/orders/1232/details"
                  slot="client"
                  slot-scope="text"
                  align="center"
                >
                  {{ text }}
                </span>
                <span slot="orderId" slot-scope="text">#{{ text?.id }}</span>
                <span
                  slot="text"
                  slot-scope="text"
                  class="app-text"
                  @click="handleApp(text)"
                  >Посмотреть текст</span
                >
                <span
                  slot="status"
                  slot-scope="tags"
                  class="tags-style"
                  :class="{
                    tag_success: tags == 'selected',
                    tag_rejected: tags == 'notSelected',
                  }"
                >
                  <!-- 'new', 'canceled', 'accepted', 'in_process' -->
                  {{ status[tags] }}
                </span>
                <span slot="btns" slot-scope="text">
                  <!-- <span
                  v-if="checkAccess('orders', 'put')"
                  class="action-btn"
                  v-html="eyeIcon"
                  @click="$router.push(`/orders/order/${text}`)"
                >
                </span> -->
                  <span
                    v-if="checkAccess('orders', 'put')"
                    class="action-btn"
                    @click="$router.push(`/orders/order/${text}`)"
                    v-html="editIcon"
                  >
                  </span>
                  <span
                    class="action-btn"
                    @click="deleteAction(text)"
                    v-html="deleteIcon"
                  >
                  </span>
                </span>
              </a-table>
              <div class="d-flex justify-content-between mt-4">
                <a-select
                  v-model="params.pageSize"
                  class="table-page-size"
                  style="width: 120px"
                  @change="
                    ($event) =>
                      changePageSizeGlobal($event, '/orders/all-orders', '__GET_ORDERS')
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
            <div
              class="card_block main-table px-4 py-4"
              v-if="$route.hash == '#complaints'"
            >
              <FormTitle title="Жалобы" />
              <a-table
                :columns="columnsComp"
                :data-source="order?.complaints"
                :pagination="false"
                :loading="loading"
                align="center"
              >
                <span
                  to="/orders/1232/details"
                  slot="client"
                  slot-scope="text"
                  align="center"
                >
                  {{ text }}
                </span>
                <span slot="orderId" slot-scope="text">#{{ text?.id }}</span>
                <span
                  slot="text"
                  slot-scope="text"
                  class="app-text"
                  @click="handleComp(text)"
                  >Посмотреть текст</span
                >
                <span
                  slot="status"
                  slot-scope="tags"
                  class="tags-style"
                  :class="{
                    tag_success: tags == 'selected',
                    tag_rejected: tags == 'notSelected',
                  }"
                >
                  {{ status[tags] }}
                </span>
                <span slot="btns" slot-scope="text">
                  <span
                    v-if="checkAccess('orders', 'put')"
                    class="action-btn"
                    @click="$router.push(`/orders/order/${text}`)"
                    v-html="editIcon"
                  >
                  </span>
                  <span
                    class="action-btn"
                    @click="deleteAction(text)"
                    v-html="deleteIcon"
                  >
                  </span>
                </span>
              </a-table>
              <div class="d-flex justify-content-between mt-4">
                <a-select
                  v-model="params.pageSize"
                  class="table-page-size"
                  style="width: 120px"
                  @change="
                    ($event) =>
                      changePageSizeGlobal($event, '/orders/all-orders', '__GET_ORDERS')
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
        </a-spin>
      </div>
    </a-form-model>

    <a-modal
      v-model="visible"
      class="text-modal"
      centered
      :title="'Текст предложения'"
      width="720px"
      @ok="handleOk"
    >
      <div class="d-flex flex-column">
        <div class="head">
          <ul>
            <li>{{ currentApp?.freelancer?.name }} - {{ currentApp?.freelancer?.id }}</li>
            <li>
              Price:
              {{
                currentApp?.price
                  ? currentApp.price.toLocaleString()
                  : "По договоренности"
              }}
            </li>
            <li>
              Srok:
              {{
                currentApp?.deadline ? `${currentApp.deadline} дней` : "По договоренности"
              }}
            </li>
          </ul>
        </div>
        <div class="body">
          <p>
            {{ currentApp?.additional_info }}
          </p>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="visibleComp"
      class="text-modal"
      centered
      :title="'Текст жалобы'"
      width="720px"
      @ok="handleOk"
    >
      <div class="d-flex flex-column">
        <div class="head">
          <ul>
            <li>
              {{ currentComp?.freelancer?.name }} - {{ currentComp?.freelancer?.id }}
            </li>
            <li>
              Дата:
              {{ moment(currentComp.created_at).format("HH:mm DD.MM.YYYY") }}
            </li>
          </ul>
        </div>
        <div class="body">
          <p>
            {{ currentComp?.complaints }}
          </p>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import FormTitle from "../../../components/Form-title.vue";
import TitleBlock from "../../../components/Title-block.vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import status from "../../../mixins/status";
import columns from "../../../mixins/columns";
import global from "../../../mixins/global";
import authAccess from "../../../mixins/authAccess";
import BiletCard from "../../../components/cards/biletCard.vue";
import moment from "moment";

import OrderShow from "@/components/show/OrderShow.vue";

export default {
  mixins: [status, authAccess, columns, global],
  head: {
    title: "Заказ",
  },
  data() {
    return {
      filter: undefined,
      loading: false,
      data: [
        {
          id: 1,
          freelancer: "Order name",
          phone_number: "+998 99 730 14 99",
          term: "24",
          date: "24/09/2024",
          price: "2000000",
          text: "Kategoriya",
          status: "selected",
        },
        {
          id: 2,
          freelancer: "Order name",
          phone_number: "+998 99 730 14 99",
          term: "24",
          date: "24/09/2024",
          price: "2000000",
          text: "Kategoriya",
          status: "notSelected",
        },
      ],
      status: {
        selected: "Выбрано",
        notSelected: "Не выбран",
      },
      visible: false,
      visibleComp: false,
      spinning: false,
      delayTime: 0,
      emptyDate: [],
      currentDay: new Date(),
      disabledBtn: true,
      targetTicket: {},
      disabledDates: [],
      ticketIcon: require("../../../assets/svg/ticket.svg?raw"),
      editIcon: require("../../../assets/svg/edit.svg?raw"),
      deleteIcon: require("../../../assets/svg/delete.svg?raw"),

      statusValue: "new",
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
      statusData: [
        {
          label: "Ожидание",
          value: "in_process",
        },
        {
          label: "Принятые",
          value: "accepted",
        },
        {
          label: "Отмененные",
          value: "canceled",
        },
      ],
      order: {
        client: {
          id: "",
          name: "",
          phone_number: "",
        },
        user: {
          name: "",
          created_at: "",
        },
      },
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
      rulesModal: {
        session: [
          {
            required: true,
            message: "This field is required",
            trigger: "change",
          },
        ],
      },
      formModal: {
        name: "",
        order_id: null,
        session: null,
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
        user: {
          name: "",
        },
        poster: "",
        instagram: "",
        telegram: "",
        facebook: "",
        visible: false,
      },
      sessions: {},
      currentApp: {},
      currentComp: {},
    };
  },
  computed: {
    classObject: function () {
      return {
        "status-process": this.statusValue == "in_process",
        "status-inactive": this.statusValue == "canceled",
        "status-accepted": this.statusValue == "accepted",
      };
    },
  },
  async mounted() {
    this.$store.dispatch("getOrders");
    this.__GET_ORDERS_BY_ID();
  },

  methods: {
    async handleApp(obj) {
      console.log(obj);
      this.currentApp = await obj;
      this.visible = true;
    },
    async handleComp(obj) {
      console.log(obj);
      this.currentComp = await obj;
      this.visibleComp = true;
    },
    disabledDate(current) {
      return (
        (current && current.valueOf() < Date.now()) ||
        this.disabledDates.find((date) => date === moment(current).format("YYYY-MM-DD"))
      );
    },
    async changeCalendar(e) {
      this.currentDay = e;
      this.disabledDays();
    },
    countSumm() {
      let summ = 0;
      this.targetTicket.data.forEach((elem) => {
        summ += elem.count;
      });
      return summ;
    },
    async panelChange(e) {
      this.currentDay = await e;
      await this.__GET_EMPTY_DATE();
      await this.disabledDays();
    },
    async editTicket(data) {
      this.targetTicket = await data;
      await this.__GET_EMPTY_DATE();
      await this.disabledDays();
      this.visible = true;
    },
    disabledDays() {
      const dates = this.emptyDate.filter((item) => item.available < this.countSumm());
      if (dates.length > 0) {
        this.disabledDates = dates.map((elem) => {
          return `${moment(this.currentDay).format("YYYY")}-${moment(
            this.currentDay
          ).format("MM")}-${
            JSON.stringify(elem.day)?.length == 1 ? `0${elem.day}` : elem.day
          }`;
        });
      } else {
        this.disabledDates = dates;
      }
      console.log(this.disabledDates);
    },
    getListData(value) {
      let listData;

      this.emptyDate.forEach((item) => {
        if (value.date() == item.day) {
          if (Number(item.available) >= Number(this.countSumm())) {
            listData = [
              {
                type: "success",
                content: `${item.available}`,
              },
            ];
          } else {
            listData = [
              {
                type: "error",
                content: `${item.available}`,
              },
            ];
          }
        }
      });

      return listData || [];
    },

    getMonthData(value) {
      if (value.month() === 8) {
        return 1394;
      }
    },
    moment,
    downloadItem(url) {
      this.$axios
        .$get(url, { responseType: "blob" })
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/pdf" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "Safar park ticket";
          link.click();
          URL.revokeObjectURL(link.href);
        })
        .catch((err) => {
          this.statusFunc(err);
        });
    },
    onSubmit() {
      this.__EDIT_CATEGORIES({ status: this.statusValue });
    },
    handleOk() {
      this.visible = false;
    },
    saveCalendar() {
      this.__EDIT_ORDER();
    },
    saveData() {
      this.$refs["ruleFormSession"].validate((valid) => {
        if (valid) {
          this.__EDIT_ORDER();
        } else {
          return false;
        }
      });
    },
    async __EDIT_CATEGORIES(res) {
      try {
        await this.$store.dispatch("fetchOrders/editOrders", {
          id: this.$route.params.index,
          data: res,
        });
        this.$store.dispatch("getOrders");
        this.$router.go(-1);
        this.notification("success", "success", "Заказ успешно изменена");
      } catch (e) {
        this.statusFunc(e);
      }
    },
    async __EDIT_ORDER(res) {
      try {
        await this.$store.dispatch("fetchTariff/editTicket", {
          order_id: this.targetTicket.id,
          date: moment(this.currentDay).format("YYYY-MM-DD"),
          session: this.formModal.session,
        });
        this.__GET_ORDERS_BY_ID();
        this.visibleSessions = false;
        this.visible = false;
        this.$store.dispatch("getOrders");
        this.notification("success", "success", "Успешно изменена");
      } catch (e) {
        console.log(e);
        this.statusFunc(e);
      }
    },
    async __GET_ORDERS_BY_ID(id) {
      try {
        const data = await this.$store.dispatch(
          "fetchOrders/getOrdersById",
          this.$route.params.index
        );
        this.order = data?.content;

        this.spinning = false;
      } catch (e) {
        console.log(e);
        this.statusFunc(e);
      }
    },
    async __GET_EMPTY_DATE(data) {
      try {
        const data = await this.$store.dispatch("fetchTariff/getEmptyDate", {
          month: moment(this.currentDay).format("MM"),
          year: moment(this.currentDay).format("YYYY"),
          tariff_id: this.targetTicket?.tariff?.id,
        });
        this.emptyDate = data?.days;
      } catch (e) {
        this.statusFunc(e);
      }
    },
    async __GET_TARIFF_SESSIONS(data1) {
      try {
        const data = await this.$store.dispatch("fetchTariff/getTariffSessions", data1);
        console.log(data);
        this.sessions = data.sessions;
        this.formModal.session = null;
        if (this.sessions == null) {
          this.disabledBtn = false;
        } else if (this.sessions.length > 0) {
          this.disabledBtn = true;
          this.visibleSessions = true;
          this.visible = false;
        }
      } catch (e) {
        this.statusFunc(e);
      }
    },
  },
  components: { TitleBlock, FormTitle, BiletCard, OrderShow },
};
</script>
<style lang="css">
@import "../../../assets/css/pages/order.css";
.ant-fullcalendar-fullscreen .ant-fullcalendar-month,
.ant-fullcalendar-fullscreen .ant-fullcalendar-date {
  height: 70px !important;
}
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
.events {
  list-style: none;
  margin: 0;
  padding: 0;
}
.events .ant-badge-status {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  font-size: 12px;
}
.notes-month {
  text-align: center;
  font-size: 28px;
}
.notes-month section {
  font-size: 28px;
}
.ant-fullcalendar-last-month-cell {
  pointer-events: none !important;
  opacity: 0;

  background-color: rgba(0, 0, 0, 0.06) !important;
}
.ant-fullcalendar-next-month-btn-day,
.ant-fullcalendar-last-month-btn-day {
  pointer-events: none !important;
  opacity: 0;
}
.ant-fullcalendar td {
  overflow: hidden;
}
.ant-fullcalendar-disabled-cell {
  background-color: rgba(0, 0, 0, 0.06) !important;
}
.ant-fullcalendar-fullscreen .ant-fullcalendar-header .ant-radio-group {
  display: none !important;
}
.app-text {
  text-decoration: underline;
  color: #5c46e5;
  cursor: pointer;
}
.text-modal .ant-modal-footer {
  display: none;
}
.text-modal .head ul {
  list-style: none;
}
.text-modal .head ul li {
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
}
.text-modal .body {
  border-top: 1px solid rgb(0, 0, 0, 0.2);
  padding-top: 16px;
}
.text-modal .body p {
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
}
</style>
