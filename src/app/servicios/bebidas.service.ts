import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BebidasService {

  private url = "https://www.thecocktaildb.com/api/json/v1/1";

  private obtener(url: string) {
    return fetch(url)
      .then(response => response.json())
      .catch(error => {
        console.error('Error al obtener los datos de bebidas:', error);
        throw error;
      });
  }

  // https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita
  bebidaPorNombre(nombre: string) {
    return this.obtener(this.url + "/search.php?s=" + encodeURIComponent(nombre));
  }

  // https://www.thecocktaildb.com/api/json/v1/1/search.php?i=vodka
  ingredientePorNombre(nombre: string) {
    return this.obtener(this.url + "/search.php?i=" + encodeURIComponent(nombre));
  }

  // Alcoholic | Non_Alcoholic
  // https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic
  bebidasPorTipo(tipo: string) {
    return this.obtener(this.url + "/filter.php?a=" + tipo);
  }

  // Ordinary_Drink | Cocktail
  // https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Ordinary_Drink
  bebidasPorCategoria(categoria: string) {
    return this.obtener(this.url + "/filter.php?c=" + categoria);
  }

  bebidaPorId(id: string) {
    return this.obtener(this.url + "/lookup.php?i=" + id);
  }

  bebidaAleatoria() {
    return this.obtener(this.url + "/random.php");
  }

}
