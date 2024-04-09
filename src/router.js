import { createRouter, createWebHashHistory } from 'vue-router';
import RegForm from "@/components/register/RegForm.vue";
import LoginForm from "@/components/login/LoginForm.vue";
import Main from "@/components/main/Main.vue";
import Detail from "@/components/main/Detail.vue";


export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: "/register", component: RegForm},
        {path: "/login", component: LoginForm},
        {path: "/main", component: Main, alias: '/'},
        {path: "/detail/:service_id", name: "Detail", component: Detail}
    ]
})

