import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PedidoService } from '../../servicios/pedido.service';

@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navegacion.component.html',
  styleUrl: './navegacion.component.css'
})
export class NavegacionComponent {

  pedidoService = inject(PedidoService);

}