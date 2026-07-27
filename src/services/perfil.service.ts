import instance from './api';

export async function funPerfil() {
    const respuesta = await instance.get('/v1/auth/profile');
    return respuesta.data;
}

