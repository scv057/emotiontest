/**
 * @author Administrator
 * @date 2020-2020/3/22-22:53
 */
import VueRouter from 'vue-router'

import Index from "@/pages/Index";
import Test from "@/pages/Test";
import Trytry from "@/pages/Trytry";
import Heath from "@/pages/Heath";
import HeathTest from "@/pages/HeathTest";

const routes = [
    {path: '/', component: Index},
    {path: '/test', component: Test},
    {path: "/try", component: Trytry},
    {path: '/heath', component: Heath},
    {path: '/heathtest', component: HeathTest}
]

const router = new VueRouter({routes})

export default router
