import api from "./api";
export default {
  funListar() {
    return api.get("/usuario");
  },

  funMostrar(id: number){
    return api.get("/usuario/"+id);
  },

  funGuardar(datos: any){
    return api.post("/usuario", datos);
  },

  funModificar(id: number, datos: any){
    return api.put("/usuario/"+id, datos);
  },

  funEliminar(id: number){
    return api.delete("/usuario/"+id);
  }
};
