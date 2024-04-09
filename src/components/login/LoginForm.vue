<template>
  <div class="content" style="display: flex; flex-direction: column; align-items: center; width: 100%;margin-top: 5%;">
    <h1>Войти</h1>

    <form id="login-form" method="post" style="display:flex;flex-direction: column;width: 25%;" class="reg-form form mt-5" @submit.prevent="loginUser">

      <input type="email" v-model.trim="loginForm.username" class="form-control mt-2" placeholder="Почта" name="email" id="email">

      <input type="password" v-model.trim="loginForm.password" class="form-control mt-2" placeholder="Пароль" name="password" id="password">

      <p style="color: red;">{{ errorMessage }}</p>

      <button id="reg_button" type="submit" class="btn btn-secondary mt-3">Войти</button>
    </form>

    <button @click="goToRegisterPage" class="btn btn-link mt-2">Зарегистрироваться</button>

  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      errorMessage: ''
    }
  },
  methods: {
    goToRegisterPage() {
      this.$router.replace("/register")
    },
    loginUser() {
      if (this.validateForm()) {
        const formData = new URLSearchParams();
        // Добавляем поля формы
        for (const [key, value] of Object.entries(this.loginForm)) {
          formData.append(key, value);
        }

        fetch("http://127.0.0.1:8000/api/auth/jwt/login", {
          method: "POST",
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData
        })
            .then(response => {
              if (response.status === 200) {
                response.json().then(data => {
                  localStorage.setItem("token", data.access_token)
                  this.$router.replace("/")
                })
              } else if (response.status === 400) {
                this.errorMessage = "Неверные учетные данные"
                return null
              } else {
                this.errorMessage = "Непревиденная ошибка"
                return null
              }
            })


      }
    },
    validateForm() {
      let flags = []

      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!re.test(String(this.loginForm.username).toLowerCase())) {document.querySelector("#email").classList.add("is-invalid"); flags.push(false)} else {document.querySelector("#email").classList.replace("is-invalid", "is-valid"); flags.push(true)}


      if (this.loginForm.password.length < 8) {document.querySelector("#password").classList.add("is-invalid"); flags.push(false)} else {document.querySelector("#password").classList.replace("is-invalid", "is-valid"); flags.push(true)}

      return flags.every(el => el)
    }
  }
}
</script>

<style scoped>

</style>