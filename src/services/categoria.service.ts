import api from "./api";
export default {
  funListar() {
    return api.get("/categoria");
  },

  funMostrar(id: number){
    return api.get("/categoria/"+id);
  },

  funGuardar(datos: any){
    return api.post("/categoria", datos);
  },

  funModificar(id: number, datos: any){
    return api.put("/categoria/"+id, datos);
  },

  funEliminar(id: number){
    return api.delete("/categoria/"+id);
  }
};
