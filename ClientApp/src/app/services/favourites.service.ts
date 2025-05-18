import { Injectable, inject } from "@angular/core";
import { ApiService } from "./api.service";


@Injectable({
  providedIn: 'root'
})
export class FavouritesService {
  private readonly favouriteKey = 'FavouriteWorldObjects';

  toggleFavourite(id: string) {
    //TODO: use it when updating signal
    const favourites = this.getFavourites();
    if (favourites.includes(id)) {
      const index = favourites.indexOf(id);
      favourites.splice(index, 1);
    } else {
      favourites.push(id);
    }
    localStorage.setItem(this.favouriteKey, JSON.stringify(favourites));
  }

  getFavourites(): string[] {
    const localStorageEntry = localStorage.getItem(this.favouriteKey);
    if (!localStorageEntry) {
      return [];
    }
    return JSON.parse(localStorageEntry);
  }
}
