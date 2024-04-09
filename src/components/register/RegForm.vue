<template>
  <div class="content" style="display: flex; flex-direction: column; align-items: center; width: 100%;margin-top: 5%;">
    <h1>Регистрация</h1>

    <form id="reg-form" method="post" style="display:flex;flex-direction: column;" class="reg-form form" @submit.prevent="registerUser">
      <!-- HTML код для переключателя -->
      <div class="switch">
        <input type="checkbox" v-model="regForm.role" name="role" id="toggle"/>
        <label for="toggle">
          <span class="text">Учитель</span>
          <span class="slider"></span>
          <span class="text">Ученик</span>
        </label>
      </div>

      <div class="input-group mb-3">
        <input type="text" v-model.trim="regForm.first_name" placeholder="Имя" class="form-control" name="first_name" id="first_name" >
        <input type="text" v-model.trim="regForm.second_name" class="form-control" placeholder="Фамилия" name="second_name" id="second_name">
        <input type="text" v-model.trim="regForm.last_name" class="form-control" placeholder="Отчество" name="last_name" id="last_name">
      </div>


      <input type="email" v-model.trim="regForm.email" class="form-control" placeholder="Почта" name="email" id="email">
      <input type="text" v-model.trim="regForm.card_number" class="form-control mt-1" placeholder="Номер карты" maxlength="16" name="card_number" id="card_number">

      <div class="input-group mt-3 mb-5">
        <input type="password" v-model.trim="regForm.password" class="form-control" placeholder="Пароль" name="password" id="password">
        <input type="password" @input="validateRepeatPassword" v-model.trim="regForm.repeat_password" class="form-control" placeholder="Повторите пароль" name="repeat_password" id="repeat_password">
      </div>

      <p style="color: red">{{errorMessage}}</p>

      <button id="reg_button" type="submit" class="btn btn-secondary">Зарегистрироваться</button>
    </form>
    <button @click="goToLogin" class="btn btn-link mt-2">Войти</button>
  </div>

</template>

<style>
.switch {
  position: relative;
  width: 200px;
  height: 50px;
  margin: 20px auto;
  transition: all .3s;
}

.switch:hover {
  transform: scale(1.01);
}

.switch input {
  display: none;
}

.switch label {
  display: block;
  width: 100%;
  height: 100%;
  background-color: #2A2929;
  border-radius: 25px;
  cursor: pointer;
  border: solid 1px #C0BEBE;
}

.switch label .text {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  font-weight: bold;
  color: white;
  opacity: 0;
}

.switch label .text:first-child {
  left: 50px;
}

.switch label .text:last-child {
  right: 50px;
}

.switch label .slider {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

.switch input:checked + label .slider {
  transform: translateX(150px);
}

.switch input:checked + label .text:first-child {
  opacity: 1;
}

.switch input:not(:checked) + label .text:last-child {
  opacity: 1;
}
</style>

<script>

export default {
  data() {
    return {
      regForm: {
        first_name: '',
        second_name: '',
        last_name: '',
        email: '',
        card_number: '',
        password: '',
        repeat_password: '',
        role: false,
        role_id: 0
      },
      errorMessage: ''
    }
  },
  methods: {
    goToLogin() {
      this.$router.replace("/login")
    },
    registerUser() {
      if (this.validateForm()) {
        this.regForm.role_id = this.reformatRole()

        const { repeat_password, role, ...formDataWithoutRepeat } = this.regForm;
        const formData = JSON.stringify(formDataWithoutRepeat);

        // todo сделать показ ошибок сервера
        fetch("http://127.0.0.1:8000/api/auth/register", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: formData
        })
            .then(response => {
              if (response.status === 201) {
                this.$router.replace("/login")
              } else if (response.status === 400) {
                this.errorMessage = "Пользователь с такими данными уже существует"
              } else {
                this.errorMessage = "Непредвиденная ошибка"
              }
            })

      }
    },
    validateForm() {
      let flags = []
      if (this.regForm.first_name < 5 || this.regForm.first_name.split(" ").length > 1) {document.querySelector("#first_name").classList.add("is-invalid"); flags.push(false)} else {document.querySelector("#first_name").classList.replace("is-invalid", "is-valid"); flags.push(true)}
      if (this.regForm.second_name < 5 || this.regForm.second_name.split(" ").length > 1) {document.querySelector("#second_name").classList.add("is-invalid"); flags.push(false)} else {document.querySelector("#second_name").classList.replace("is-invalid", "is-valid"); flags.push(true)}
      if (this.regForm.last_name < 5 || this.regForm.last_name.split(" ").length > 1) {document.querySelector("#last_name").classList.add("is-invalid"); flags.push(false)} else {document.querySelector("#last_name").classList.replace("is-invalid", "is-valid"); flags.push(true)}

      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!re.test(String(this.regForm.email).toLowerCase())) {document.querySelector("#email").classList.add("is-invalid"); flags.push(false)} else {document.querySelector("#email").classList.replace("is-invalid", "is-valid"); flags.push(true)}

      if (this.regForm.card_number.replace(" ", "").length !== 16) {document.querySelector("#card_number").classList.add("is-invalid"); flags.push(false)} else {document.querySelector("#card_number").classList.replace("is-invalid", "is-valid"); flags.push(true)}

      if (this.regForm.password.length < 8) {document.querySelector("#password").classList.add("is-invalid"); flags.push(false)} else {document.querySelector("#password").classList.replace("is-invalid", "is-valid"); flags.push(true)}

      if (!this.validateRepeatPassword()) {document.querySelector("#repeat_password").classList.add("is-invalid"); flags.push(false)} else {document.querySelector("#repeat_password").classList.replace("is-invalid", "is-valid"); flags.push(true)}

      return flags.every(el => el)
    },
    validateRepeatPassword() {
      return this.regForm.password === this.regForm.repeat_password
    },
    reformatRole() {
      return (this.regForm.role) ? 2 : 1
    }
  }

}
</script>
