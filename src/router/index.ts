import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Inicio from "../views/web/Inicio.vue";
import Nosotros from "../views/web/Nosotros.vue";
import Servicios from "../views/web/Servicios.vue";
import Login from "../views/auth/Login.vue";
import WebLayout from "../layout/WebLayout.vue";
import AppLayout from "../layout/AppLayout.vue";
import Dashboard from "../views/admin/Dashboard.vue";
import Perfil from "../views/admin/Perfil.vue";
import Usuario from "../views/admin/Usuario.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: WebLayout,
    children: [
      { path: "/", component: Inicio },
      { path: "/acercade", component: Nosotros },
      { path: "/servicios", component: Servicios },
       // requiere autenticación
      {
        path: "/auth/ingresar",
        name: "Login",
        meta: { redirectIfAuth: true },
        component: Login
      },
    ],
  },
  {
    path: "/admin",
    component: AppLayout,
    meta: { requiredAuth: true }, // requiere autenticacion para acceder a esta direccion
    children: [
      { path: "", component: Dashboard },
      { path: "perfil", component: Perfil, name: "Perfil" },
      { path: "usuario", component: Usuario },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guards de Navegacion
router.beforeEach((to, from) => {
  const token = localStorage.getItem("access_token");
  console.log(`Voy hacia: ${JSON.stringify(to.path)}`);
  console.log(`Vengo de: ${JSON.stringify(from.path)}`);

  if (to.meta.requiredAuth) {
    if (!token) {
      return { name: "Login" };
    }

    return true;
  }

  if (to.meta.redirectIfAuth && token) {
    return { name: "Perfil" };
  }

  return true;
});

export default router;
