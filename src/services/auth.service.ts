import instance from "./api";

export async function loginConLaravel(email: string, password: string){
    const respuesta = await instance.post('/v1/auth/login', {email, password});
    return respuesta;
}