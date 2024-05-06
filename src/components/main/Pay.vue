<script>
export default {
  name: "Pay",
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    formattingCardNumber() {
      this.card_number = this.card_number.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim()
    },
    formattingDate() {
      this.date = this.date.replace(/[^\dA-Z]/g, '').replace(/(.{2})/, '$1/').slice(0,5)
    },
    checkAuth() {
      let token = localStorage.getItem('token')
      if (!token) {
        this.$router.replace('/login')
        return false
      }

      return true
    }
  },
  data(){
    return {
      card_number: '',
      date: ''
    }
  },
  mounted() {
    this.checkAuth()
  },
  activated() {
    this.checkAuth()
  },
  created() {
    this.checkAuth()
  }
}
</script>

<template>
<div class="content" style="margin-top: 5%">
  <p @click="goBack" style="cursor: pointer"><- Назад</p>
  <h1>Оплата услуги</h1>

  <div class="container my-5 py-5" data-bs-theme="dark">
    <div class="row d-flex justify-content-center py-5">
      <div class="col-md-7 col-lg-5 col-xl-4">
        <div style="border-radius: 15px" class="card" >
          <div class="card-body p-4">

            <form style="display: flex; flex-direction: column">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div data-mdb-input-init class="form-outline">
                  <input type="text" id="typeText" class="form-control form-control-lg" siez="17"
                         placeholder="1234 5678 9012 3457" v-model.trim="card_number" @input="formattingCardNumber" minlength="19" maxlength="19" />
                  <label class="form-label" for="typeText">Номер карты</label>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-4">
                <div data-mdb-input-init class="form-outline">
                  <input type="text" id="typeName" class="form-control form-control-lg" siez="17"
                         placeholder="Cardholder's Name" />
                  <label class="form-label" for="typeName">Имя держателя карты</label>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center pb-2">
                <div data-mdb-input-init class="form-outline">
                  <input type="text" id="typeExp" class="form-control form-control-lg" placeholder="MM/YY"
                         size="7" minlength="7" v-model="date" @input="formattingDate" maxlength="7" />
                  <label class="form-label" for="typeExp">Дата</label>
                </div>
                <div data-mdb-input-init class="form-outline">
                  <input type="password" id="typeText2" class="form-control form-control-lg"
                         placeholder="&#9679;&#9679;&#9679;" size="1" minlength="3" maxlength="3" />
                  <label class="form-label" for="typeText2">Cvv</label>
                </div>
              </div>
              <button style="" type="submit" data-mdb-button-init data-mdb-ripple-init class="btn btn-info btn-lg btn-rounded">
                💰 Pay
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<style scoped>

</style>