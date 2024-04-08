<template lang="html">
  <div class="">
    <TitleBlock title="Dashboard" :breadbrumb="['Главный']" lastLink="Dashboard">
    </TitleBlock>
    <div class="container_xl app-container pb-5 pt-5">
      <div >
        <div class="statistic_grid">
          <div class="statistic_card">
            <h4>
              Количество заказов на сегодня
            </h4>
            <h3 class="statistic_blue">{{ dashboad?.orders_count_per_day }}</h3>
          </div>
          <div class="statistic_card">
            <h4>
              Сумма заказов на сегодня
            </h4>
            <h3 class="statistic_green">{{ dashboad?.orders_amount_per_day }}</h3>
          </div>
          <div class="statistic_card">
            <h4>
              Новые пользователи на сегодня
            </h4>
            <h3  class="statistic_purple">{{ dashboad?.new_user_per_day }}</h3>
          </div>
        </div>
        <div class="statistic_grid mt-4">
          <div class="statistic_card">
            <h4 class="title_grey">
              Всего заказов
            </h4>
            <h3 >{{ dashboad?.all_orders_count }}</h3>
          </div>
          <div class="statistic_card">
            <h4 class="title_grey">
              Сумма заказов за вес период
            </h4>
            <h3>{{ dashboad?.all_orders_amount }}</h3>
          </div>
          <div class="statistic_card">
            <h4 class="title_grey">
              Количество пользователей
            </h4>
            <h3 >{{ dashboad?.all_users_count }}</h3>
          </div>
        </div>
      </div>
    </div></div>

</template>
<script>
export default {
  data() {
    return {
      dashboad: {}
    }
  },
  mounted() {
    this.__GET_DASHBOARD()
  },
  methods: {
    async __GET_DASHBOARD() {
      try {
        const data = await this.$store.dispatch('fetchDashboard/getDashboard');
        console.log(data)
        this.dashboad = data?.content
      } catch (e) {

      }
    }
  }
}
</script>
<style lang="css">
.statistic_grid {
  display:grid;
  grid-template-columns: repeat(3,1fr);
  gap: 8px;
}
.statistic_card {
  border-radius: 10px;
  background: #FFF;
  padding: 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.statistic_card h4 {
  color: #000;
  font-family: "TT Interfaces";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 150% */
}
.statistic_card h3 {

  font-family: "TT Interfaces";
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 100% */
}
.statistic_blue {
  color: #437FEC;
}
.statistic_green {
  color: #00B2A9;
}
.statistic_purple {
  color: #AD00C9;
}
.title_grey {
  color: #878787 !important;
}
</style>
