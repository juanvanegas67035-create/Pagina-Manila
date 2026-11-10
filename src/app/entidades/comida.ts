export class Comida {
    id: string = "";
    nombre: string = "";
    categoria: string = "";
    origen: string = "";
    imagen: string = "";
    ingredientes: string[] = [];
    precio: number = 0;
tipo: any;

    constructor() {}

    // Llena el objeto con los datos que devuelve la API de comidas
    llenarDatos(datos: any) {
        this.id = datos.idMeal;
        this.nombre = datos.strMeal;
        this.categoria = datos.strCategory;
        this.origen = datos.strArea;
        this.imagen = datos.strMealThumb;

        this.ingredientes = [];
        for (let i = 1; i <= 20; i++) {
            const ingrediente = datos["strIngredient" + i];
            if (ingrediente && ingrediente.trim() !== "") {
                this.ingredientes.push(ingrediente.trim());
            }
        }

        // La API no trae precio: se asigna uno aleatorio entre 10.000 y 40.000
        this.precio = (Math.floor(Math.random() * 31) + 10) * 1000;
    }
}