import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  private urlComidas = "https://www.themealdb.com/api/json/v1/1";
  private urlBebidas = "https://www.thecocktaildb.com/api/json/v1/1";

  private obtener(url: string) {
    return fetch(url)
      .then(response => response.json())
      .catch(error => {
        console.error('Error al obtener los datos:', error);
        throw error;
      });
  }

  comidaPorNombre(nombre: string) {
    return this.obtener(this.urlComidas + "/search.php?s=" + encodeURIComponent(nombre));
  }

  comidaPorLetra(letra: string) {
    return this.obtener(this.urlComidas + "/search.php?f=" + letra);
  }

  comidasPorIngrediente(ingrediente: string) {
    const texto = ingrediente.trim().replace(/\s+/g, "_");
    return this.obtener(this.urlComidas + "/filter.php?i=" + encodeURIComponent(texto));
  }

  comidaPorId(id: string) {
    return this.obtener(this.urlComidas + "/lookup.php?i=" + id);
  }

  comidaAleatoria() {
    return this.obtener(this.urlComidas + "/random.php");
  }

  bebidaPorNombre(nombre: string) {
    return this.obtener(this.urlBebidas + "/search.php?s=" + encodeURIComponent(nombre));
  }

  ingredientePorNombre(nombre: string) {
    return this.obtener(this.urlBebidas + "/search.php?i=" + encodeURIComponent(nombre));
  }

  bebidasPorTipo(tipo: string) {
    return this.obtener(this.urlBebidas + "/filter.php?a=" + tipo);
  }

  bebidasPorCategoria(categoria: string) {
    return this.obtener(this.urlBebidas + "/filter.php?c=" + categoria);
  }

  bebidaPorId(id: string) {
    return this.obtener(this.urlBebidas + "/lookup.php?i=" + id);
  }

  bebidaAleatoria() {
    return this.obtener(this.urlBebidas + "/random.php");
  }

}