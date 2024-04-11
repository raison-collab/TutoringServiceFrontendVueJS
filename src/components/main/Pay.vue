<script>
export default {
  name: "Pay",
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<template>
<div class="content" style="margin-top: 5%">
  <h1>В разработке</h1>
  <p @click="goBack" style="cursor: pointer"><- Назад</p>
</div>
</template>

<style scoped>

</style>