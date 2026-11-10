import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../servicios/api.service';
import { Celda } from '../../entidades/celda';

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css'
})
export class JuegoComponent implements OnInit, OnDestroy {

  private apiService = inject(ApiService);
  private platformId = inject(PLATFORM_ID);
  private temporizador: any;

  celdas: Celda[] = this.crearCeldas(-1, -1);   // matriz 4x4 = 16 celdas

  imagenPlato: string = "";
  nombrePlato: string = "";
  imagenBebida: string = "";
  nombreBebida: string = "";

  posPlato: number = -1;
  posBebida: number = -1;
  encontroPlato: boolean = false;
  encontroBebida: boolean = false;

  intentos: number = 0;
  rondas: number = 0;
  estado: string = "Cargando...";
  bloqueado: boolean = true;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.reiniciar();
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.temporizador);
  }

  // Trae un plato y una bebida al azar de las APIs y empieza de cero
  reiniciar() {
    clearTimeout(this.temporizador);
    this.bloqueado = true;
    this.intentos = 0;
    this.rondas = 0;
    this.posPlato = -1;
    this.posBebida = -1;
    this.estado = "Cargando imágenes...";

    this.apiService.comidaAleatoria()
      .then(data => {
        this.imagenPlato = data.meals[0].strMealThumb;
        this.nombrePlato = data.meals[0].strMeal;
        return this.apiService.bebidaAleatoria();
      })
      .then(data => {
        this.imagenBebida = data.drinks[0].strDrinkThumb;
        this.nombreBebida = data.drinks[0].strDrink;
        this.nuevaRonda();
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
        this.estado = "No se pudieron cargar las imágenes. Pulsa reiniciar.";
      });
  }

  crearCeldas(posPlato: number, posBebida: number): Celda[] {
    const lista: Celda[] = [];
    for (let i = 0; i < 16; i++) {
      const celda = new Celda();
      if (i === posPlato) {
        celda.contenido = "plato";
      } else if (i === posBebida) {
        celda.contenido = "bebida";
      }
      lista.push(celda);
    }
    return lista;
  }

  // Esconde plato y bebida en posiciones distintas a las de la ronda anterior
  nuevaRonda() {
    let plato = Math.floor(Math.random() * 16);
    while (plato === this.posPlato) {
      plato = Math.floor(Math.random() * 16);
    }

    let bebida = Math.floor(Math.random() * 16);
    while (bebida === plato || bebida === this.posBebida) {
      bebida = Math.floor(Math.random() * 16);
    }

    this.posPlato = plato;
    this.posBebida = bebida;
    this.celdas = this.crearCeldas(plato, bebida);

    this.encontroPlato = false;
    this.encontroBebida = false;
    this.bloqueado = false;
    this.estado = "Buscando el plato y la bebida...";
  }

  destapar(indice: number) {
    const celda = this.celdas[indice];
    if (this.bloqueado || celda.abierta) {
      return;
    }

    celda.abierta = true;
    this.intentos++;

    if (celda.contenido === "plato") {
      this.encontroPlato = true;
    }
    if (celda.contenido === "bebida") {
      this.encontroBebida = true;
    }

    if (this.encontroPlato && this.encontroBebida) {
      this.rondas++;
      this.bloqueado = true;
      this.estado = "¡Los encontraste! Nueva ronda en 2 segundos...";
      this.temporizador = setTimeout(() => this.nuevaRonda(), 2000);
    } else if (this.encontroPlato) {
      this.estado = "¡Encontraste el plato! Falta la bebida";
    } else if (this.encontroBebida) {
      this.estado = "¡Encontraste la bebida! Falta el plato";
    } else {
      this.estado = "Sigue buscando...";
    }
  }

}