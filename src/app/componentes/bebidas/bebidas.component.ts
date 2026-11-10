import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../servicios/api.service';
import { PedidoService } from '../../servicios/pedido.service';
import { Bebida } from '../../entidades/bebida';
import { Ingrediente } from '../../entidades/ingrediente';
import { ItemPedido } from '../../entidades/item-pedido';

@Component({
  selector: 'app-bebidas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bebidas.component.html',
  styleUrl: './bebidas.component.css'
})
export class BebidasComponent implements OnInit {
  categorias: any[] = [];
  
  private apiService = inject(ApiService);
  private pedidoService = inject(PedidoService);
  private platformId = inject(PLATFORM_ID);

  titulo: string = "Todas las bebidas";
  bebidas: Bebida[] = [];
  pendientes: any[] = [];   // bebidas que faltan por mostrar (solo traen nombre y foto)
  ingrediente: Ingrediente | null = null;

  nombreBusqueda: string = "";
  ingredienteBusqueda: string = "";
  tipoSeleccionado: string = "";
  categoriaSeleccionada: string = "";

  cargando: boolean = false;
  mensaje: string = "";

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarTodas();
    }
  }

  // Deja la pantalla limpia antes de cada consulta
  reiniciar(titulo: string) {
    this.titulo = titulo;
    this.bebidas = [];
    this.pendientes = [];
    this.ingrediente = null;
    this.mensaje = "";
    this.cargando = true;
  }

  // Si no hay resultados la API devuelve null, por eso se revisa antes
  listaDe(data: any): any[] {
    return Array.isArray(data.drinks) ? data.drinks : [];
  }

  // Vista inicial: bebidas ordinarias + cocteles
  cargarTodas() {
    this.reiniciar("Todas las bebidas");
    this.nombreBusqueda = "";
    this.ingredienteBusqueda = "";
    this.tipoSeleccionado = "";
    this.categoriaSeleccionada = "";

    Promise.all([
      this.apiService.bebidasPorCategoria("Ordinary_Drink"),
      this.apiService.bebidasPorCategoria("Cocktail")
    ])
      .then(respuestas => {
        this.pendientes = this.listaDe(respuestas[0]).concat(this.listaDe(respuestas[1]));
        this.verMas();
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
        this.mensaje = "No se pudieron cargar las bebidas. Intenta de nuevo.";
        this.cargando = false;
      });
  }

  // Coctel por nombre
  buscarPorNombre() {
    const texto = this.nombreBusqueda.trim();
    if (texto === "") {
      this.cargarTodas();
      return;
    }

    this.reiniciar('Resultados para "' + texto + '"');
    this.ingredienteBusqueda = "";
    this.tipoSeleccionado = "";
    this.categoriaSeleccionada = "";

    this.apiService.bebidaPorNombre(texto)
      .then(data => {
        for (let datos of this.listaDe(data)) {
          const bebida = new Bebida();
          bebida.llenarDatos(datos);
          this.bebidas.push(bebida);
        }
        if (this.bebidas.length === 0) {
          this.mensaje = "No se encontraron cocteles con ese nombre.";
        }
        this.cargando = false;
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
        this.mensaje = "Ocurrió un error al buscar. Intenta de nuevo.";
        this.cargando = false;
      });
  }

  // Ingrediente por nombre
  buscarIngrediente() {
    const texto = this.ingredienteBusqueda.trim();
    if (texto === "") {
      this.cargarTodas();
      return;
    }

    this.reiniciar("Ingrediente: " + texto);
    this.nombreBusqueda = "";
    this.tipoSeleccionado = "";
    this.categoriaSeleccionada = "";

    this.apiService.ingredientePorNombre(texto)
      .then(data => {
        if (data.ingredients) {
          const ingrediente = new Ingrediente();
          ingrediente.llenarDatos(data.ingredients[0]);
          this.ingrediente = ingrediente;
        } else {
          this.mensaje = "No se encontró ese ingrediente. Prueba en inglés (Ej: Vodka, Gin, Lime).";
        }
        this.cargando = false;
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
        this.mensaje = "Ocurrió un error al buscar. Intenta de nuevo.";
        this.cargando = false;
      });
  }

  // Filtrar por tipo: Alcoholic o Non_Alcoholic
  filtrarPorTipo(valor: string) {
    this.tipoSeleccionado = valor;
    if (valor === "") {
      this.cargarTodas();
      return;
    }

    if (valor === "Alcoholic") {
      this.reiniciar("Bebidas alcohólicas");
    } else {
      this.reiniciar("Bebidas sin alcohol");
    }
    this.categoriaSeleccionada = "";
    this.nombreBusqueda = "";
    this.ingredienteBusqueda = "";

    this.apiService.bebidasPorTipo(valor)
      .then(data => this.mostrarFiltro(data))
      .catch(error => this.errorFiltro(error));
  }

  // Filtrar por categoría: Ordinary_Drink o Cocktail
  filtrarPorCategoria(valor: string) {
    this.categoriaSeleccionada = valor;
    if (valor === "") {
      this.cargarTodas();
      return;
    }

    if (valor === "Cocktail") {
      this.reiniciar("Cocteles");
    } else {
      this.reiniciar("Bebidas ordinarias");
    }
    this.tipoSeleccionado = "";
    this.nombreBusqueda = "";
    this.ingredienteBusqueda = "";

    this.apiService.bebidasPorCategoria(valor)
      .then(data => this.mostrarFiltro(data))
      .catch(error => this.errorFiltro(error));
  }

  mostrarFiltro(data: any) {
    this.pendientes = this.listaDe(data);
    if (this.pendientes.length === 0) {
      this.mensaje = "No hay bebidas para este filtro.";
      this.cargando = false;
    } else {
      this.verMas();
    }
  }

  errorFiltro(error: any) {
    console.error('Error al obtener los datos:', error);
    this.mensaje = "Ocurrió un error al filtrar. Intenta de nuevo.";
    this.cargando = false;
  }

  // El filtro solo trae nombre y foto, por eso se pide el detalle (ingredientes) de 12 en 12
  verMas() {
    this.cargando = true;
    const lote = this.pendientes.splice(0, 12);
    const peticiones: Promise<any>[] = [];
    for (let resumen of lote) {
      peticiones.push(this.apiService.bebidaPorId(resumen.idDrink));
    }

    Promise.all(peticiones)
      .then(respuestas => {
        for (let respuesta of respuestas) {
          const bebida = new Bebida();
          bebida.llenarDatos(respuesta.drinks[0]);
          this.bebidas.push(bebida);
        }
        this.cargando = false;
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
        this.mensaje = "No se pudieron cargar las bebidas.";
        this.cargando = false;
      });
  }

  pedir(bebida: Bebida) {
    const item = new ItemPedido();
    item.id = "bebida-" + bebida.id;
    item.nombre = bebida.nombre;
    item.precio = bebida.precio;
    item.tipo = "Bebida";
    this.pedidoService.pedido.agregar(item);
  }

  resumenDescripcion(texto: string): string {
    if (texto.length > 450) {
      return texto.substring(0, 450) + "...";
    }
    return texto;
  }

}