import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private storageKey = 'favoriteMeals';

  getFavorites(): string[] {
    const favs = localStorage.getItem(this.storageKey);
    return favs ? JSON.parse(favs) : [];
  }

  isFavorite(mealId: string): boolean {
    return this.getFavorites().includes(mealId);
  }

  addFavorite(mealId: string): void {
    const favs = this.getFavorites();
    if (!favs.includes(mealId)) {
      favs.push(mealId);
      localStorage.setItem(this.storageKey, JSON.stringify(favs));
    }
  }

  removeFavorite(mealId: string): void {
    const favs = this.getFavorites().filter(id => id !== mealId);
    localStorage.setItem(this.storageKey, JSON.stringify(favs));
  }

  toggleFavorite(mealId: string): void {
    this.isFavorite(mealId) ? this.removeFavorite(mealId) : this.addFavorite(mealId);
  }
} 
 