import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../servicios/api.service';
import { Comida } from '../../entidades/comida';
import { Bebida } from '../../entidades/bebida';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  private apiService = inject(ApiService);
  private platformId = inject(PLATFORM_ID);

  platoEstrella: Comida | null = null;
  bebidaEstrella: Bebida | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.obtenerPlatoEstrella();
      this.obtenerBebidaEstrella();
    }
  }

  obtenerPlatoEstrella() {
    this.apiService.comidaPorNombre("Arrabiata")
      .then(data => {
        if (data.meals) {
          const comida = new Comida();
          comida.llenarDatos(data.meals[0]);
          this.platoEstrella = comida;
        }
      })
      .catch(error => {
        console.error('Error al obtener el plato estrella:', error);
      });
  }

  obtenerBebidaEstrella() {
    this.apiService.bebidaPorNombre("Margarita")
      .then(data => {
        if (data.drinks) {
          const bebida = new Bebida();
          bebida.llenarDatos(data.drinks[0]);
          this.bebidaEstrella = bebida;
        }
      })
      .catch(error => {
        console.error('Error al obtener la bebida estrella:', error);
      });
  }

}