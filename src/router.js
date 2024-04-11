import { createRouter, createWebHashHistory } from 'vue-router';
import RegForm from "@/components/register/RegForm.vue";
import LoginForm from "@/components/login/LoginForm.vue";
import Main from "@/components/main/Main.vue";
import Detail from "@/components/main/Detail.vue";
import AddService from "@/components/main/AddService.vue";
import MyServices from "@/components/main/MyServices.vue";
import Pay from "@/components/main/Pay.vue";


export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: "/register", component: RegForm},
        {path: "/login", component: LoginForm, name: "Login"},
        {path: "/main", component: Main, alias: '/'},
        {path: "/detail/:service_id", name: "Detail", component: Detail},
        {path: "/add-service", name: "AddService", component: AddService},
        {path: "/my-services", name: "MyServices", component: MyServices},
        {path: "/pay", name: "Pay", component: Pay}
    ]
})

