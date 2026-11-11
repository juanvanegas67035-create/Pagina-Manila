import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComidasService {

  private url = "https://www.themealdb.com/api/json/v1/1";

  private obtener(url: string) {
    return fetch(url)
      .then(response => response.json())
      .catch(error => {
        console.error('Error al obtener los datos de comidas:', error);
        throw error;
      });
  }

  // https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata
  comidaPorNombre(nombre: string) {
    return this.obtener(this.url + "/search.php?s=" + encodeURIComponent(nombre));
  }

  // https://www.themealdb.com/api/json/v1/1/search.php?f=a
  comidaPorLetra(letra: string) {
    return this.obtener(this.url + "/search.php?f=" + letra);
  }

  // https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast
  comidasPorIngrediente(ingrediente: string) {
    const texto = ingrediente.trim().replace(/\s+/g, "_");
    return this.obtener(this.url + "/filter.php?i=" + encodeURIComponent(texto));
  }

  comidaPorId(id: string) {
    return this.obtener(this.url + "/lookup.php?i=" + id);
  }

  comidaAleatoria() {
    return this.obtener(this.url + "/random.php");
  }

}
