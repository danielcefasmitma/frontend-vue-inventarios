<template>
    <h1>App Layout</h1>
    <RouterLink to="/admin">PANEL ADMINISTRATIVO</RouterLink>|
    <RouterLink to="/admin/perfil">MI PERFIL</RouterLink>|
    <RouterLink to="/">VOLVER A LA PAGINA DE INICIO</RouterLink>

    <router-view/>
</template>