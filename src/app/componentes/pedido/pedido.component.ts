import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../servicios/pedido.service';
import { Pedido } from '../../entidades/pedido';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponent {

  private pedidoService = inject(PedidoService);

  pedido: Pedido = this.pedidoService.pedido;
  error: string = "";
  realizado: boolean = false;

  cambiarCantidad(id: string, cambio: number) {
    this.pedido.cambiarCantidad(id, cambio);
    this.realizado = false;
  }

  quitar(id: string) {
    this.pedido.quitar(id);
    this.realizado = false;
  }

  realizarPedido() {
    this.error = "";

    if (this.pedido.items.length === 0) {
      this.error = "Agrega al menos un plato o una bebida desde Comidas o Bebidas.";
      return;
    }
    if (this.pedido.cliente.nombreCompleto.trim() === "") {
      this.error = "Ingresa tu nombre completo.";
      return;
    }
    if (this.pedido.cliente.celular.trim().length !== 10 || isNaN(Number(this.pedido.cliente.celular))) {
      this.error = "El celular debe tener 10 dígitos.";
      return;
    }
    if (this.pedido.cliente.direccion.trim() === "") {
      this.error = "Ingresa la dirección de entrega.";
      return;
    }

    this.pedido.fecha = new Date();
    this.realizado = true;

    // Baja hasta el formato de pedido
    setTimeout(() => {
      document.getElementById("formato-pedido")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  nuevoPedido() {
    this.pedido.vaciar();
    this.realizado = false;
    this.error = "";
  }

  dinero(valor: number): string {
    return "$" + valor.toLocaleString("en-US") + " COP";
  }

  async descargarPdf() {
    // jsPDF se carga aquí (y no arriba) para que no cause problemas con el servidor (SSR)
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // Encabezado con el logo
    doc.setFillColor(11, 11, 11);
    doc.rect(0, 0, 210, 40, "F");
    doc.setFillColor(218, 175, 59);
    doc.circle(25, 20, 11, "F");
    doc.setTextColor(11, 11, 11);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("M", 25, 23.5, { align: "center" });
    doc.setTextColor(218, 175, 59);
    doc.setFontSize(26);
    doc.text("MANILA", 42, 20);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Restaurante - Formato de pedido", 42, 27);
    doc.text("Fecha: " + this.pedido.fecha.toLocaleDateString("es-CO"), 195, 20, { align: "right" });

    // Datos del cliente
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("DATOS DEL CLIENTE", 15, 54);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Nombre: " + this.pedido.cliente.nombreCompleto, 15, 62);
    doc.text("Celular: " + this.pedido.cliente.celular, 15, 69);
    doc.text("Dirección: " + this.pedido.cliente.direccion, 15, 76);

    // Lista del pedido
    let y = 92;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("LISTA DEL PEDIDO", 15, y - 8);
    doc.setFontSize(10);
    doc.text("Producto", 15, y);
    doc.text("Cant.", 115, y, { align: "center" });
    doc.text("Precio", 155, y, { align: "right" });
    doc.text("Subtotal", 195, y, { align: "right" });
    doc.line(15, y + 2, 195, y + 2);

    doc.setFont("helvetica", "normal");
    y = y + 9;
    for (let item of this.pedido.items) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(item.nombre.substring(0, 45), 15, y);
      doc.text(String(item.cantidad), 115, y, { align: "center" });
      doc.text(this.dinero(item.precio), 155, y, { align: "right" });
      doc.text(this.dinero(item.calcularSubtotal()), 195, y, { align: "right" });
      y = y + 8;
    }

    // Total a pagar
    doc.line(15, y, 195, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TOTAL A PAGAR: " + this.dinero(this.pedido.calcularTotal()), 195, y + 10, { align: "right" });

    doc.save("pedido-manila.pdf");
  }

}