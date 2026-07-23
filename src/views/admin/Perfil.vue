<template>
    <h1>Mi perfil</h1>
    <h4>Nombre: {{ perfil.data.name }}</h4>
    <h4>EMAIL: {{ perfil.data.email }}</h4>
    <h4>Ecreado en: {{ perfil.data.created_at }}</h4>
    <h1>Datos </h1>
</template>

<script setup>
import { ref } from 'vue';
import { funPerfil } from '../../services/perfil.service';
const perfil = ref({});
async function funObtenerPerfil() {

    perfil.value = await funPerfil()
}

funObtenerPerfil();
</script>