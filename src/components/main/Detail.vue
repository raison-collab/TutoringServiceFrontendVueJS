<script>
export default {
  name: "Detail",
  created() {
    this.service_id = this.$route.params.service_id;
  },
  mounted() {
    this.getService()
  },
  activated() {
    this.getService()
  },
  data () {
    return {
      service_id: null,
      service: {},
      backHost: import.meta.env.VITE_SERVER_HOST,
      backPort: import.meta.env.VITE_SERVER_PORT,
      backProtocol: import.meta.env.VITE_SERVER_PROTOCOL
    }
  },
  watch: {
    "$route.params.service_id": {
      immediate: true,
      handler(newVal) {
        this.service_id = newVal;
        this.getService();
      }
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    goPay() {
      this.$router.push({name: "Pay"})
    },
    async getService() {
      let token = localStorage.getItem('token')
      if (!token) {
        this.$router.replace('/login');
        return null
      }

      try {
        const response = await fetch(`${this.backProtocol}://${this.backHost}:${this.backPort}/api/service/${this.service_id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          },
          method: "GET"
        });

        if (response.status === 200) {
          const data = await response.json();
          const userData = await this.getUserServiceData(data.user_id)
          const subject = await this.getSubject(data.subject_id)

          const updatedData = {
            ...data,
            userData,
            subject
          }

          this.service = updatedData;
        } else if (response.status === 401) {
          this.$router.replace("/login");
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
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
    async getSubject(subject_id) {
      if (subject_id === undefined) {
        return null
      }
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
  }
}
</script>

<template>
<div class="content" style="margin-top: 5%">
  <p @click="goBack" style="cursor: pointer"><- Назад</p>
  <h1>Подробности услуги</h1>

  <div class="content">
    <div class="card border-secondary" data-bs-theme="dark" style="background: none">
      <h5 class="card-header border-secondary">{{ service.subject.name }}</h5>
      <div class="card-body">
        <h5 class="card-title">ФИО: {{service.userData.s_name}} {{service.userData.f_name}} {{service.userData.l_name}}</h5>
        <p class="card-text"><b>Цена:</b> {{service.amount}} ₽</p>
        <p class="card-text">Описание услуги: {{service.info}}</p>
        <button @click="goPay" class="btn btn-primary">Оплатить</button>
      </div>
    </div>
  </div>
</div>
</template>

<style>

</style>