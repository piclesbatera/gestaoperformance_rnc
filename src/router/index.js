import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "@/components/auth/Login";
import error404 from "@/components/errors/404";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/rnc",
    name: "rnc",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/RNC/rnc.vue")
  },
  {
    path: "/perfil",
    name: "Perfil",
    component: () =>
      import(/*webpackChunkName: "profile" */ "@/views/Perfil/Perfil")
  },
  {
    path: "/gestao",
    name: "Gestao",
    component: () =>
      import(/*webpackChunkName: "profile" */ "@/views/Gestao/paginaGestao")
  },
  { path: '/404', component: error404 },  
  { path: '*', redirect: '/404' },  
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
