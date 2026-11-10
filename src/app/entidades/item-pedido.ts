export class ItemPedido {
    id: string = "";
    nombre: string = "";
    precio: number = 0;
    cantidad: number = 0;
    tipo: string = "";

    constructor() {}

    calcularSubtotal(): number {
        return this.precio * this.cantidad;
    }
}