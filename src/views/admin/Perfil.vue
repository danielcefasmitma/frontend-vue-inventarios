<template>
    <h1>Mi perfil</h1>
    <h4>Nombre: {{ perfil.name }}</h4>
    <h4>EMAIL: {{ perfil.email }}</h4>
    <h4>Ecreado en: {{ perfil.created_at }}</h4>
    <button @click="funSalir()">Cerrar Sesion</button>
    <h1>Datos </h1>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { funPerfil } from '../../services/perfil.service';
import { logoutConLaravel } from './../../services/auth.service.ts';
const perfil = ref<any>({});
async function funObtenerPerfil() {
    const respuesta = await funPerfil();
    perfil.value = respuesta;
}

funObtenerPerfil();

async function funSalir() {
    await logoutConLaravel();
    funObtenerPerfil();
}
</script>