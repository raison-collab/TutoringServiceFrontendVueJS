<script>
export default {
  name: "MyServices",
  created() {
    this.getRole()
    this.getServices()
  },
  data () {
    return {
      services: [],
      is_teacher: false,
      backHost: import.meta.env.VITE_SERVER_HOST,
      backPort: import.meta.env.VITE_SERVER_PORT,
      backProtocol: import.meta.env.VITE_SERVER_PROTOCOL
    }
  },
  methods: {
    async getServices() {
      try {
        const response = await fetch(`${this.backProtocol}://${this.backHost}:${this.backPort}/api/services`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          method: "GET"
        });

        if (response.status === 200) {
          const payload = this.decodeJWT(localStorage.getItem("token"))
          const data = await response.json();
          const updatedData = await Promise.all(data.map(async (el) => {

            const subject = await this.getSubject(el.subject_id);
            const userData = await this.getUserServiceData(el.user_id);
            let info = el.info.length < 100 ? el.info : el.info.slice(0, 97)+"..."
            return {
              ...el,
              info: info,
              subject: subject.name,
              user_f_name: userData.f_name,
              user_l_name: userData.l_name
            };
          }));

          this.services = updatedData.filter(el => el.user_id === parseInt(payload.sub));
        } else if (response.status === 401) {
          this.$router.replace("/login");
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    },
    async getSubject(subject_id) {
      return fetch(`${this.backProtocol}://${this.backHost}:${this.backPort}/api/subject/${subject_id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
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
    goToDetailView(service_id) {
      this.$router.push({ name: 'Detail', params: { service_id } })
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
    async deleteService(service_id, user_id) {
      const payload = this.decodeJWT(localStorage.getItem("token"))

      if (user_id === parseInt(payload.sub)) {
        fetch(`${this.backProtocol}://${this.backHost}:${this.backPort}/api/service/${service_id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          method: "DELETE",
        }).then(resp => {
          if (resp.status === 200) {
            this.services = this.getServices()
          } else if (resp.status === 401) {
            this.$router.replace({name: "Login"})
            return null
          } else {
            return null
          }
        })
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
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<template>
  <div class="perm" v-if="!is_teacher">
    <h1 >Нет прав</h1>
    <p @click="goBack" style="cursor: pointer"><- Назад</p>
  </div>



  <div v-if="is_teacher" class="content" style="margin-top: 5%;">
    <p @click="goBack" style="cursor: pointer"><- Назад</p>
    <h1>Мои услуги</h1>

    <div class="services" style="display: flex;flex-wrap: wrap;">

      <div data-bs-theme="dark" class="card border-secondary mt-1" style="width: 18rem; background: none; margin-right: 2%" v-for="service in services" :key="service.id">
        <div class="card-header border-secondary">{{service.subject}}</div>
        <div class="card-body">
          <h6 class="card-subtitle mb-2 text-body-secondary">{{service.user_f_name}} {{service.user_l_name}}</h6>
          <h6 class="card-subtitle mb-2 text-body-secondary">Цена: {{service.amount}} ₽</h6>
          <p class="card-text">Описание: {{ service.info }}</p>
        </div>
        <div class="card-footer">
          <button @click="goToDetailView(service.id)" class="btn btn-link">Подробнее</button>
          <button @click="deleteService(service.id, service.user_id)" style="color: red; float: right" class="btn btn-link">Удалить</button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>