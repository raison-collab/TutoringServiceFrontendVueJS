<script>
export default {
  name: "AddService",
  created() {
    this.getRole()
    this.getSubjects()
  },
  data() {
    return {
      is_teacher: false,
      subjects: [],
      selectedSubject: '',
      servicePrice: '',
      serviceDescription: '',
      isShowDescriptionLabel: true,
      backHost: import.meta.env.VITE_SERVER_HOST,
      backPort: import.meta.env.VITE_SERVER_PORT,
      backProtocol: import.meta.env.VITE_SERVER_PROTOCOL
    }
  },
  methods: {
    async getSubjects() {
      return fetch(`${this.backProtocol}://${this.backHost}:${this.backPort}/api/subjects`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        method: "GET"
      }).then(resp => {
        if (resp.status === 200) {
          resp.json().then(data => {
            this.subjects = data
          })
        } else if (resp.status === 401) {
          this.$router.replace("/login")
          return null
        } else {
          return null
        }
      })
    },
    hideDescriptionLabel(){
      if (this.serviceDescription){
        this.isShowDescriptionLabel = false
      } else {
        this.isShowDescriptionLabel = !this.isShowDescriptionLabel
      }

    },
    validateForm() {
      let flags = []

      if (!this.selectedSubject || this.selectedSubject === '') {
        document.querySelector("#subject-select").classList.add("is-invalid")
        flags.push(false);
      } else {
        document.querySelector("#subject-select").classList.replace("is-invalid", "is-valid");
        flags.push(true)
      }

      const price = parseFloat(this.servicePrice);
      if (isNaN(price) || price <= 0) {
        document.querySelector("#servicePrice").classList.add("is-invalid")
        flags.push(false);
      } else {
        document.querySelector("#servicePrice").classList.replace("is-invalid", "is-valid");
        flags.push(true)
        this.servicePrice = price
      }

      if (!this.serviceDescription || this.serviceDescription.trim() === '') {
        document.querySelector("#floatingTextarea2").classList.add("is-invalid")
        flags.push(false);
      } else {
        document.querySelector("#floatingTextarea2").classList.replace("is-invalid", "is-valid");
        flags.push(true)
      }

      return flags.every(el => el)
    },
    decodeJWT (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const payload = JSON.parse(atob(base64));
        return payload;
      } catch (e) {
        return  null
      }
    },
    async getRole() {
      let token = localStorage.getItem('token')
      if (!token) {
        this.$router.replace('/login')
        return null
      }

      let payload = this.decodeJWT(token)
      const userData = await this.getUserServiceData(payload.sub)

      fetch(`${this.backProtocol}://${this.backHost}:${this.backPort}/api/role/${userData.role_id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        method : "GET"
      }).then(resp => {
        if (resp.status === 200) {
          resp.json().then(data => {
            if (data.name === "Учитель") {
              this.is_teacher = true
            }
          })
        }
      })
    },
    async getUserServiceData(user_id) {
      return fetch(`${this.backProtocol}://${this.backHost}:${this.backPort}/api/user/service-data/${user_id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        method: "GET"
      }).then(resp => {
        if (resp.status === 200) {
          return resp.json()
        } else if (resp.status === 401) {
          this.$router.replace("/login")
          return null
        } else {
          return null
        }
      })
    },
    async addService() {
      if (this.validateForm()) {
        let token = localStorage.getItem('token')
        if (!token) {
          this.$router.replace('/login')
          return null
        }

        const payload = this.decodeJWT(token)
        const userData = await this.getUserServiceData(payload.sub)

        const formData = {
          "subject_id": this.selectedSubject,
          "user_id": parseInt(payload.sub),
          "amount": this.servicePrice,
          "info": this.serviceDescription
        }

        fetch(`${this.backProtocol}://${this.backHost}:${this.backPort}/api/service`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify(formData)
        }).then(resp => {
          if (resp.status === 200) {
            this.$router.go(-1)
          } else if (resp.status === 401) {
            this.$router.replace('/login')
            return null
          } else {
            return null
          }

        })
      }
    }
  }
}
</script>

<template>
  <div class="perm" v-if="!is_teacher">
    <h1 >Нет прав</h1>
    <p @click="goBack" style="cursor: pointer"><- Назад</p>
  </div>

<div class="content" v-if="is_teacher" style="display: flex; flex-direction: column; align-items: center; width: 100%;margin-top: 5%;">
  <h1>Добавить услугу</h1>

  <form style="margin-top: 5%; display: flex;flex-direction: column" @submit.prevent="addService">
    <select id="subject-select" class="form-select" v-model="selectedSubject">
      <option value="0" disabled>Выберите предмет</option>
      <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
        {{ subject.name }}
      </option>
    </select>

    <div class="input-group mb-3" style="margin-top: 2%">
      <span class="input-group-text">₽</span>
      <span class="input-group-text">0.00</span>
      <input type="text" class="form-control" v-model.trim="servicePrice" placeholder="Цена за услугу" id="servicePrice">
    </div>

    <div class="form-floating" @focusin="hideDescriptionLabel" @focusout="hideDescriptionLabel">
      <textarea class="form-control" v-model.trim="serviceDescription" placeholder="Информация об услуге (контакты преподавателя и прочая информация)" id="floatingTextarea2" style="min-height: 100px"></textarea>
<!--      <label v-if="isShowDescriptionLabel" for="floatingTextarea2" style="color: #2A2929">Подробное описание для услуги (контакты преподавателя и пр)</label>-->
    </div>

    <button type="submit" class="btn btn-secondary mt-3">Добавить услугу</button>
  </form>
</div>
</template>

<style scoped>

</style>