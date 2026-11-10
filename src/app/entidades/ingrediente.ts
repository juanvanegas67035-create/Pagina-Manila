export class Ingrediente {
    id: string = "";
    nombre: string = "";
    tipo: string = "";
    alcohol: string = "";
    descripcion: string = "";
    imagen: string = "";

    constructor() {}

    llenarDatos(datos: any) {
        this.id = datos.idIngredient;
        this.nombre = datos.strIngredient;
        this.tipo = datos.strType ? datos.strType : "No especificado";
        this.descripcion = datos.strDescription ? datos.strDescription : "Sin descripción disponible.";
        this.imagen = "https://www.thecocktaildb.com/images/ingredients/" + encodeURIComponent(datos.strIngredient) + "-Medium.png";

        if (datos.strAlcohol === "Yes") {
            this.alcohol = "Sí";
        } else {
            this.alcohol = "No";
        }
    }
}