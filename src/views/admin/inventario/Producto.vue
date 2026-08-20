<template>
    <h1>Lista de Productos</h1>
    {{ lazyParams }}
    <div class="card">
        <Toolbar class="mb-6">
            <template #start>
                <Button label="Nuevo Producto" icon="pi pi-plus" class="mr-2" @click="openNew" />
            </template>

            <template #end>
                <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" customUpload
                    chooseLabel="Importar" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
                <Button label="Exportar" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
            </template>
        </Toolbar>

        <DataTable ref="dt" lazy :loading="cargando" :value="productos" :totalRecords="totalRecords"
            @page="onPage($event)" dataKey="id" :paginator="true" :rows="10"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Mostrando {first} al {last} de {totalRecords} productos">
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">Gestionar Productos</h4>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText placeholder="Buscar..." v-model="buscar" @keyup.enter="funListarProductos()" />
                    </IconField>
                </div>
            </template>

            <Column field="id" header="Codigo" sortable style="min-width: 12rem"></Column>
            <Column field="nombre" header="Nombre" sortable style="min-width: 16rem"></Column>
            <Column header="Imagen">
                <template #body="slotProps">
                    <img :src="`http://backinventarios.blumbit.net/${slotProps.data.image}`" :alt="slotProps.data.image"
                        class="rounded" style="width: 64px" />
                </template>
            </Column>
            <Column field="precio_venta_actual" header="Precio" sortable style="min-width: 8rem">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.precio_venta_actual) }}
                </template>
            </Column>
            <Column field="category" header="Categoria" sortable style="min-width: 10rem"></Column>

            <Column field="estado" header="Estado" sortable style="min-width: 12rem">
                <template #body="slotProps">
                    {{ slotProps.data.estado }}
                </template>
            </Column>
            <Column :exportable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" variant="outlined" rounded class="mr-2"
                        @click="editProduct(slotProps.data)" />
                    <Button icon="pi pi-trash" variant="outlined" rounded severity="danger"
                        @click="confirmDeleteProduct(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Detalle de Productos" :modal="true">
            {{ product }}
            <div class="flex flex-col gap-6">
                <img v-if="product.imagen" :src="`https://backinventarios.blumbit.net/${product.imagen}`"
                    :alt="product.imagen" class="block m-auto pb-4" />
                <div>
                    <label for="name" class="block font-bold mb-3">Nombre</label>
                    <InputText id="name" v-model.trim="product.nombre" required="true" autofocus
                        :invalid="submitted && !product.nombre" fluid />
                    <small v-if="submitted && !product.nombre" class="text-red-500">Nombre es Obligatorio.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Descripcion</label>
                    <Textarea id="description" v-model="product.descripcion" required="true" rows="3" cols="20" fluid />
                </div>

                <div>
                    <span class="block font-bold mb-4">Categoria</span>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="flex items-center gap-2 col-span-6" v-for="cat in categorias">
                            <RadioButton :id="`category${cat.id}`" v-model="product.categoria_id" name="category"
                                :value="`${cat.id}`" />
                            <label :for="`category${cat.id}`">{{ cat.nombre }}</label>
                        </div>

                    </div>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">Precio venta</label>
                        <InputNumber id="price" v-model="product.precio_venta_actual" mode="currency"
                            currency="BOB" locale="en-US" fluid />
                    </div>
                    <div class="col-span-6">
                        <label for="quantity" class="block font-bold mb-3">Estado</label>
                        <input type="checkbox" v-model="product.estado">
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Guardar" icon="pi pi-check" @click="saveProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="product">Are you sure you want to delete <b>{{ product.nombre }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" severity="secondary"
                    variant="text" />
                <Button label="Yes" icon="pi pi-check" @click="deleteProduct" severity="danger" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="product">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" severity="secondary"
                    variant="text" />
                <Button label="Yes" icon="pi pi-check" text @click="" severity="danger" />
            </template>
        </Dialog>
    </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import productoService from '../../../services/producto.service';
import categoriaService from '../../../services/categoria.service';

interface ProductoInterface {
    id?: number,
    nombre: string,
    descripcion?: string,
    precio_venta_actual?: number,
    imagen?: string,
    estado: boolean,
    categoria_id: number,
    created_at?: string
    updated_at?: string
}

const dt = ref();
const productos = ref<ProductoInterface[]>([{ categoria_id: -1, nombre: "", estado: true, imagen: "" }]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const submitted = ref(false);
const product = ref<ProductoInterface>({ nombre: "", estado: true, categoria_id: -1, precio_venta_actual: 0 });
const cargando = ref<boolean>(false);
const totalRecords = ref<number>(0)
const lazyParams = ref<any>({ page: 0 });
const buscar = ref("");
const selectedAlmacen = ref(0);
const categorias = ref<any>({});

onMounted(() => {
    funListarProductos();
    funGetCategorias()
})


async function funListarProductos() {
    try {
        cargando.value = true;
        const { data } = await productoService.funListar(lazyParams.value.page + 1, lazyParams.value.rows, buscar.value, selectedAlmacen.value);
        productos.value = data.data;
        cargando.value = false;
        totalRecords.value = data.total;
    } catch (error) {
        cargando.value = false;
    }

}

const funGetCategorias = async () => {
    const { data } = await categoriaService.funListar();
    categorias.value = data;
}

const formatCurrency = (value: number) => {
    if (value)
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return;
};

const onPage = (event: any) => {
    lazyParams.value = event;
    funListarProductos();
}

const exportCSV = (event: any) => {
    dt.value.exportCSV();
};

const openNew = () => {
    product.value = { nombre: "", estado: true, categoria_id: -1, precio_venta_actual: 0 };
    submitted.value = false;
    productDialog.value = true;
};
const hideDialog = () => {
    3
    productDialog.value = false;
    submitted.value = false;
};
const saveProduct = async () => {
    submitted.value = true;

    if (product?.value.nombre?.trim()) {
        if (product.value.id) {
            // editar
        } else {
            //guardar
            await productoService.funGuardar(product.value)

        }
        productDialog.value = false;
        funListarProductos()
        product.value = { nombre: "", estado: true, categoria_id: -1, precio_venta_actual: 0 };
    }

};
const editProduct = (prod: any) => {
    product.value = { ...prod };
    productDialog.value = true;
};
const confirmDeleteProduct = (prod: any) => {
    product.value = prod;
    deleteProductDialog.value = true;
};
const deleteProduct = () => {
};

</script>