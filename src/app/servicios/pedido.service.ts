import { Injectable } from '@angular/core';
import { Pedido } from '../entidades/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  pedido: Pedido = new Pedido();

  constructor() { }

}