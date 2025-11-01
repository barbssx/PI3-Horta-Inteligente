import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import DashboardPrincipal from "@/components/DashboardPrincipal.vue";
import SobreProjeto from "@/views/SobreProjeto.vue";
import ConhecimentoView from "@/views/ConhecimentoView.vue";

const routes = [
  { path: "/", name: "HomeView", component: HomeView },
  {
    path: "/dashboard",
    name: "DashboardPrincipal",
    component: DashboardPrincipal,
  },
  { path: "/sobre", name: "SobreProjeto", component: SobreProjeto },
  {
    path: "/conhecimento",
    name: "ConhecimentoView",
    component: ConhecimentoView,
  },
  {
    path: "/previsoes",
    name: "Previsoes",
    component: () => import("@/views/MlDashboard.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
