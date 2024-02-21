<template>
  <div class="wrap">
    <div class="cardo">
      <div class="section">
        <h4 class="title">О заказе</h4>
        <div class="items">
          <div class="item">
            <p class="question">О заказе</p>
            <p class="answer">{{ order?.id }}</p>
          </div>
          <div class="item">
            <p class="question">Srok</p>
            <p class="answer" v-if="order?.deadline">{{ order?.deadline }} дней</p>
            <p class="answer" v-else>По договоренности</p>
          </div>
          <div class="item">
            <p class="question">Price</p>
            <p class="answer" v-if="order?.price">{{ order?.price.toLocaleString() }}</p>
            <p class="answer" v-else>По договоренности</p>
          </div>
          <div class="item">
            <p class="question">Клиент</p>
            <p class="answer">{{ order?.client?.name }} - {{ order?.client?.id }}</p>
          </div>
          <div class="item">
            <p class="question">Category</p>
            <p class="answer">UI/UX design</p>
          </div>
          <div class="item">
            <p class="question">Published date</p>
            <p class="answer">
              {{ publishedDate }}
            </p>
          </div>
          <div class="item">
            <p class="question">Кол-во заявок</p>
            <p class="answer">{{ order?.request_count }}</p>
          </div>
          <div class="item">
            <p class="question">Просмотры</p>
            <p class="answer">{{ order?.view_count }}</p>
          </div>
        </div>
      </div>
      <div class="section desc">
        <h4 class="title">
          {{ order?.name }}
        </h4>
        <div v-html="order?.description"></div>
      </div>
      <div class="section">
        <h4 class="title">Файлы к задаче</h4>
        <div class="files">
          <div class="file" v-for="image in order?.files">
            <div class="img">
              <img :src="`${imgUrl}${image.file}`" alt="" />
            </div>
            <!-- <p class="name">photo_202...-12.jpg</p> -->
          </div>
        </div>
      </div>
      <div class="section categories">
        <h4 class="title">Категории:</h4>
        <div class="cats">
          <span
            v-for="(item, index) in order?.specialities"
            class="d-flex align-items-center"
          >
            <div class="cat">
              <p>{{ item?.name_ru }}</p>
            </div>
            <div class="slash" v-if="order?.specialities.length != index + 1">/</div>
          </span>
          <!-- <div class="cat">
            <p>Мобильные приложения</p>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: ["order"],
  computed: {
    publishedDate() {
      return moment(this.order.created_at).format("HH:mm DD.MM.YYYY");
    },
    baseUrl() {
      return process.env.BASE_URL;
    },
    imgUrl() {
      return this.baseUrl + "/storage/";
    },
  },
  methods: {
    moment,
  },
};
</script>

<style scoped>
.title {
  color: var(--Dark-Blue, #32324d);
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 32px; /* 133.333% */
  margin-bottom: 16px;
}
.items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 16px;
}
.item {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
.question {
  color: var(--Black, #020105);
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 123.077% */
}
.answer {
  color: var(--grey-64, #5d5d5f);
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 123.077% */
}
.section {
  margin-bottom: 40px;
  max-width: 770px;
}
.section:last-child {
  margin-bottom: 0;
}
.desc p {
  color: var(--grey-80, #353437);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}
.desc p:last-child {
  margin: 0;
}
.desc a {
  color: var(--Agro-Blue, #3c4bdc);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
}
.files {
  display: flex;
  align-items: center;
  gap: 16px;
}
.img {
  width: 104px;
  height: 104px;
  border-radius: 4px;
  border: 1px solid var(--grey-8, #ebebeb);
  overflow: hidden;
  margin-bottom: 8px;
}
.img img {
  display: flex;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.name {
  color: var(--grey-80, #353437);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; /* 15.6px */
}
.cats {
  display: flex;
  align-items: center;
  gap: 8px;
}
.slash {
  margin-left: 8px;
}
.cat {
  border-radius: 22px;
  background: var(--BG-grey, #f8f9ff);
  padding: 8px 16px;
  color: var(--grey-64, #5d5d5f);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%; /* 19.6px */
}
.categories {
  padding-bottom: 48px;
}
</style>
