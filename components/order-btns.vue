<template lang="html">
  <div class="order-links-grid">
    <nuxt-link
      class="order-links"
      :class="{ 'active-orders': $route.params.status == 'in_moderation' }"
      to="/orders/in_moderation"
    >
      <span class="order-green"></span> В модерации ({{ `${$store.state.orders.all}` }})
    </nuxt-link>
    <nuxt-link
      class="order-links"
      :class="{ 'active-orders': $route.params.status == 'all-orders' }"
      to="/orders/all-orders"
    >
      <span class="order-light-blue"></span> Все заказы ({{
        `${$store.state.orders.new}`
      }})
    </nuxt-link>
    <nuxt-link
      class="order-links"
      :class="{ 'active-orders': $route.params.status == 'active' }"
      to="/orders/active"
    >
      <span class="order-blue"></span> Активные ({{
        `${$store.state.orders.in_process}`
      }})
    </nuxt-link>
    <nuxt-link
      class="order-links"
      :class="{ 'active-orders': $route.params.status == 'in_process' }"
      to="/orders/in_process"
    >
      <span class="order-black"></span> В процессе ({{
        `${$store.state.orders.accepted}`
      }})
    </nuxt-link>

    <nuxt-link
      class="order-links"
      :class="{ 'active-orders': $route.params.status == 'concel-moderator' }"
      to="/orders/concel-moderator"
    >
      <span class="order-yellow"></span> Отмена - модератор ({{
        `${$store.state.orders.is_edited}`
      }})
    </nuxt-link>
    <nuxt-link
      class="order-links"
      :class="{ 'active-orders': $route.params.status == 'cancelled' }"
      to="/orders/cancelled"
    >
      <span class="order-red"></span> Отмена - клиент({{
        `${$store.state.orders.canceled}`
      }})
    </nuxt-link>
  </div>
</template>
<script>
export default {};
</script>
