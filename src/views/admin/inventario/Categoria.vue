<template>
    <h1>Listado de Catogorias</h1>
    <pre>{{ categorias }}</pre>
    <div class="card">
        <Button label="Nueva Categoria" @click="visibleDialog = true" />

        <Dialog v-model:visible="visibleDialog" modal header="Editar Categoria" :style="{ width: '25rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Actualizar Informacion.</span>
            <div class="flex items-center gap-4 mb-4">
                <label for="username" class="font-semibold w-24">Nombre</label>
                <InputText id="username" class="flex-auto" autocomplete="off" v-model="categoria.nombre" />
            </div>
            <div class="flex items-center gap-4 mb-8">
                <label for="email" class="font-semibold w-24">Descripcion</label>
                <InputText id="email" class="flex-auto" autocomplete="off" v-model="categoria.descripcion" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancelar" severity="secondary" @click="visibleDialog = false"></Button>
                <Button type="button" label="Guardar" @click="funGuardarCategoria()"></Button>
            </div>
        </Dialog>


        <DataTable :value="categorias" tableStyle="min-width: 50rem">
            <Column field="id" header="Id"></Column>
            <Column field="nombre" header="Nombre"></Column>
            <Column field="descripcion" header="Descripcion"></Column>
            <Column field="deteleted_at" header="Deleted At"></Column>
            <Column :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2"
                        @click="funEditarCategoria(slotProps.data)" />
                    <Button icon="pi pi-trash" variant="outlined" rounded severity="danger"
                        @click="funEliminarCategoria(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import categoriaService from '../../../services/categoria.service';
const categorias = ref<any>([]);
const categoria = ref<any>({ nombre: "", descripcion: "" });
const visibleDialog = ref(false);
onMounted(() => {
    funListarCategorias();
})
async function funListarCategorias() {
    const { data } = await categoriaService.funListar();
    categorias.value = data;
}

async function funGuardarCategoria() {
    if (categoria.value.id) {
        await categoriaService.funModificar(categoria.value.id, categoria.value);
    } else {
        await categoriaService.funGuardar(categoria.value);
    }

    funListarCategorias();
    visibleDialog.value = false;
    categoria.value = {};

}

async function funEditarCategoria(cat: any) {
    visibleDialog.value = true;
    const { ...data } = cat;
    categoria.value = data;
}

async function funEliminarCategoria(cat: any) {
    if (confirm(`Estas seguro de eliminar la categoria ${cat.nombre}?`)) {
        await categoriaService.funEliminar(cat.id);
        funListarCategorias();
    }

}
</script>