import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../servicios/api.service';
import { PedidoService } from '../../servicios/pedido.service';
import { Comida } from '../../entidades/comida';
import { GrupoComidas } from '../../entidades/grupo-comidas';
import { ItemPedido } from '../../entidades/item-pedido';

@Component({
  selector: 'app-comidas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comidas.component.html',
  styleUrl: './comidas.component.css'
})
export class ComidasComponent implements OnInit {

  private apiService = inject(ApiService);
  private pedidoService = inject(PedidoService);
  private platformId = inject(PLATFORM_ID);

  comidas: Comida[] = [];
  categorias: GrupoComidas[] = [];
  nombreBusqueda: string = "";
  ingredienteBusqueda: string = "";
  cargando: boolean = false;
  mensaje: string = "";

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarTodas();
    }
  }

  // Vista inicial: todas las comidas por categorías (se piden las 26 letras del abecedario)
  cargarTodas() {
    this.cargando = true;
    this.mensaje = "";
    this.categorias = [];

    const letras = "abcdefghijklmnopqrstuvwxyz";
    const peticiones: Promise<any>[] = [];
    for (let i = 0; i < letras.length; i++) {
      peticiones.push(
        this.apiService.comidaPorLetra(letras[i]).catch(() => ({ meals: null }))
      );
    }

    // Promise.all espera a que lleguen las 26 respuestas
    Promise.all(peticiones)
      .then(respuestas => {
        this.comidas = [];
        for (let respuesta of respuestas) {
          this.comidas = this.comidas.concat(this.crearComidas(respuesta.meals));
        }
        this.agruparPorCategoria();
        this.cargando = false;
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
        this.mensaje = "No se pudo cargar el menú. Intenta de nuevo.";
        this.cargando = false;
      });
  }

  buscarPorNombre() {
    const texto = this.nombreBusqueda.trim();
    this.ingredienteBusqueda = "";

    if (texto === "") {
      this.cargarTodas();
      return;
    }

    this.cargando = true;
    this.mensaje = "";
    this.categorias = [];

    this.apiService.comidaPorNombre(texto)
      .then(data => {
        this.comidas = this.crearComidas(data.meals);
        this.mostrarResultados('Resultados para "' + texto + '"');
        this.cargando = false;
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
        this.mensaje = "Ocurrió un error al buscar. Intenta de nuevo.";
        this.cargando = false;
      });
  }

  buscarPorIngrediente() {
    const texto = this.ingredienteBusqueda.trim();
    this.nombreBusqueda = "";

    if (texto === "") {
      this.cargarTodas();
      return;
    }

    this.cargando = true;
    this.mensaje = "";
    this.categorias = [];

    // Este filtro solo trae nombre y foto, por eso se pide el detalle de cada plato
    this.apiService.comidasPorIngrediente(texto)
      .then(data => {
        const lista = data.meals ? data.meals : [];
        const peticiones: Promise<any>[] = [];
        for (let i = 0; i < lista.length && i < 20; i++) {
          peticiones.push(this.apiService.comidaPorId(lista[i].idMeal));
        }

        return Promise.all(peticiones).then(respuestas => {
          this.comidas = [];
          for (let respuesta of respuestas) {
            this.comidas = this.comidas.concat(this.crearComidas(respuesta.meals));
          }
          this.mostrarResultados('Platos con "' + texto + '"');
          this.cargando = false;
        });
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
        this.mensaje = "Ocurrió un error al buscar. Intenta de nuevo.";
        this.cargando = false;
      });
  }

  pedir(comida: Comida) {
    const item = new ItemPedido();
    item.id = "comida-" + comida.id;
    item.nombre = comida.nombre;
    item.precio = comida.precio;
    item.tipo = "Comida";
    this.pedidoService.pedido.agregar(item);
  }

  // Convierte la lista que llega de la API en objetos Comida
  crearComidas(lista: any): Comida[] {
    const comidas: Comida[] = [];
    if (lista) {
      for (let datos of lista) {
        const comida = new Comida();
        comida.llenarDatos(datos);
        comidas.push(comida);
      }
    }
    return comidas;
  }

  mostrarResultados(titulo: string) {
    if (this.comidas.length === 0) {
      this.categorias = [];
      this.mensaje = "No se encontraron platos con esa búsqueda.";
    } else {
      const grupo = new GrupoComidas();
      grupo.nombre = titulo;
      grupo.platos = this.comidas;
      this.categorias = [grupo];
    }
  }

  agruparPorCategoria() {
    this.categorias = [];
    for (let comida of this.comidas) {
      let grupo = this.categorias.find(g => g.nombre === comida.categoria);
      if (!grupo) {
        grupo = new GrupoComidas();
        grupo.nombre = comida.categoria;
        this.categorias.push(grupo);
      }
      grupo.platos.push(comida);
    }
    this.categorias.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

}