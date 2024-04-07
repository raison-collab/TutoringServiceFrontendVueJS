import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import {Vuelidate} from "vuelidate";


const app = createApp(App)
app.use(Vuelidate)
app.mount('#app')
