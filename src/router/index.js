import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import DetailedView from "../views/DetailedView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      router: "/",
      name: "All Pokemon",
      component: HomeView,
    },
    {
      path: "/pokemon/:id",
      name: "Detail",
      component: DetailedView,
    },
  ],
});

export default router;
