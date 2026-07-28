<template>
    <h1>Lista de Usuarios</h1>
    {{ usuario }}
    <form>
        <label for="">Ingrese Nombre</label>
        <input type="text" v-model="usuario.name">
        <br>
        <label for="">Ingrese Correo</label>
        <input type="email" v-model="usuario.email">
        <br>
        <label for="">Ingrese Contraseña</label>
        <input type="password" v-model="usuario.password">
        <br>
        <button type="button" @click="funGuardarUsuario()">Guardar Cambios</button>
    </form>

    <div class="card">
        <Button label="Nuevo Usuario" @click="visibleDialog = true" />

        <Dialog v-model:visible="visibleDialog" modal header="Datos Usuario" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Ingrese datos</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="username" class="font-semibold w-24">Nombre</label>
                <InputText id="username" class="flex-auto" autocomplete="off" v-model="usuario.name" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="email" class="font-semibold w-24">Correo</label>
                <InputText id="email" class="flex-auto" autocomplete="off" v-model="usuario.email" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="password" class="font-semibold w-24">Contraseña</label>
                <InputText type="password" id="password" class="flex-auto" autocomplete="off"
                    v-model="usuario.password" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="visibleDialog = false"></Button>
                <Button type="button" label="Save" @click="funGuardarUsuario()"></Button>
            </div>
        </Dialog>

        <DataTable :value="usuarios" tableStyle="min-width: 50rem" selection-mode="single">
            <Column field="id" header="Id" />
            <Column field="name" header="Name" />
            <Column field="email" header="Email" />
            <Column field="roles" header="Roles" />
            <Column field="created_at" header="Fecha Creacion" />
            <Column :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2"
                        @click="funEditarUsuario(slotProps.data)" />
                    <Button icon="pi pi-trash" variant="outlined" rounded severity="danger"
                        @click="funEliminarUsuario(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import usuarioService from '../../services/usuario.service';

onMounted(() => {
    funListarUsuarios();
})
const usuarios = ref<any>([]);
const usuario = ref<any>({ name: "", email: "", password: "" });
const visibleDialog = ref(false);

async function funListarUsuarios() {
    const { data } = await usuarioService.funListar();
    usuarios.value = data.data;
}

async function funGuardarUsuario() {
    if (usuario.value.id) {
        await usuarioService.funModificar(usuario.value.id, usuario.value);
    } else {
        await usuarioService.funGuardar(usuario.value);
    }
    funListarUsuarios();
    visibleDialog.value = false;
    usuario.value = {}
}

async function funEditarUsuario(user: any) {
    const { ...data } = user
    usuario.value = data;
    visibleDialog.value = true;

}

async function funEliminarUsuario(user: any) {
    if (confirm('Esta seguro de eliminar el usuario?')) {
        await usuarioService.funEliminar(user.id);
        funListarUsuarios();

    }
}

</script>