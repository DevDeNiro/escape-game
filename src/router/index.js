import {createRouter, createWebHistory} from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/room/:id",
    name: "Room",
    component: () => import("../views/Room.vue"),
  },
  {
    path: "/results",
    name: "Results",
    component: () => import("../views/Result.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  if (to.name === "Results" && !from.path.includes("room/")) next({name: "Home"});
  else next();
});

export default router;
