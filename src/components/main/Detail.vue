<script>
export default {
  name: "Detail",
  created() {
    this.service_id = this.$route.params.service_id;
  },
  activated() {
    this.getService()
  },
  data () {
    return {
      service_id: null,
      service: {}
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
    async getService() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/service/${this.service_id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
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
      return fetch(`http://127.0.0.1:8000/api/user/service-data/${user_id}`, {
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
      return fetch(`http://127.0.0.1:8000/api/subject/${subject_id}`, {
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
    <div class="card border-secondary" style="background: none">
      <h5 class="card-header border-secondary">{{ service.subject.name }}</h5>
      <div class="card-body">
        <h5 class="card-title">ФИО: {{service.userData.s_name}} {{service.userData.f_name}} {{service.userData.l_name}}</h5>
        <p class="card-text"><b>Цена:</b> {{service.amount}}</p>
        <p class="card-text">Описание услуги: {{service.info}}</p>
        <button class="btn btn-primary">Оплатить</button>
      </div>
    </div>
  </div>
</div>
</template>

<style>

</style>