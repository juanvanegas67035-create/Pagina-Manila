export class Bebida {
    id: string = "";
    nombre: string = "";
    categoria: string = "";
    tipo: string = "";
    imagen: string = "";
    ingredientes: string[] = [];
    precio: number = 0;

    constructor() {}

    // Llena el objeto con los datos que devuelve la API de bebidas
    llenarDatos(datos: any) {
        this.id = datos.idDrink;
        this.nombre = datos.strDrink;
        this.categoria = datos.strCategory;
        this.imagen = datos.strDrinkThumb;

        if (datos.strAlcoholic === "Alcoholic") {
            this.tipo = "Alcohólica";
        } else if (datos.strAlcoholic === "Non alcoholic") {
            this.tipo = "Sin alcohol";
        } else {
            this.tipo = datos.strAlcoholic;
        }

        this.ingredientes = [];
        for (let i = 1; i <= 15; i++) {
            const ingrediente = datos["strIngredient" + i];
            if (ingrediente && ingrediente.trim() !== "") {
                this.ingredientes.push(ingrediente.trim());
            }
        }

        // La API no trae precio: se asigna uno aleatorio entre 8.000 y 30.000
        this.precio = (Math.floor(Math.random() * 23) + 8) * 1000;
    }
}