import { Injectable } from '@angular/core';
import { Pedido } from '../entidades/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  // Un solo pedido compartido entre Comidas, Bebidas, Pedido y el menú
  pedido: Pedido = new Pedido();

  constructor() { }

}