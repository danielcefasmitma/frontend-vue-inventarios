<template>
    <h1>Inicio de Sesion</h1>

    <label for="">Ingrese su email</label>
    <input type="text" v-model="credenciales.email">
    <br>
    <label for="">Ingrese su contraseña</label>
    <input type="password" v-model="credenciales.password">
    <br>
    <button @click="funIngresar()">Ingresar</button>

</template>

<script setup>
import { ref } from 'vue';
import {useRouter} from 'vue-router'
import { loginConLaravel } from '../../services/auth.service';    

    const credenciales = ref({email: "", password: ""})
    const router = useRouter()

    async function funIngresar(){
        try {
            const resp = await loginConLaravel(credenciales.value.email, credenciales.value.password);
            console.log(resp);
            localStorage.setItem("access_token", resp.access_token);
            router.push('/admin');
        } catch (error) {
            
        }
    }
    
    
</script>