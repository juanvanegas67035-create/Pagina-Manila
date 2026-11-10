import { Cliente } from "./cliente";
import { ItemPedido } from "./item-pedido";

export class Pedido {
    cliente: Cliente = new Cliente();
    items: ItemPedido[] = [];
    fecha: Date = new Date();

    constructor() {}

    agregar(nuevo: ItemPedido) {
        for (let item of this.items) {
            if (item.id === nuevo.id) {
                item.cantidad++;
                return;
            }
        }
        nuevo.cantidad = 1;
        this.items.push(nuevo);
    }

    cambiarCantidad(id: string, cambio: number) {
        for (let item of this.items) {
            if (item.id === id) {
                item.cantidad = item.cantidad + cambio;
            }
        }
        this.items = this.items.filter(item => item.cantidad > 0);
    }

    quitar(id: string) {
        this.items = this.items.filter(item => item.id !== id);
    }

    calcularTotal(): number {
        let total = 0;
        for (let item of this.items) {
            total = total + item.calcularSubtotal();
        }
        return total;
    }

    contarProductos(): number {
        let cantidad = 0;
        for (let item of this.items) {
            cantidad = cantidad + item.cantidad;
        }
        return cantidad;
    }

    vaciar() {
        this.items = [];
        this.cliente = new Cliente();
    }
}