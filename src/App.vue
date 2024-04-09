<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="['Main']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>


<script>
import RegForm from "@/components/register/RegForm.vue";
import LoginForm from "@/components/login/LoginForm.vue";
import Main from "@/components/main/Main.vue";
import Detail from "@/components/main/Detail.vue";
export default {
  components: {
    RegForm, LoginForm, Main
  },
  data () {
    return {
      componentIsActive: true
    }
  }
}
</script>

<style>

</style>