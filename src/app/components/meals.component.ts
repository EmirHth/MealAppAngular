import { Component, inject } from '@angular/core';
import { MealDbService } from '../services/mealdb.service';
import { FavoritesService } from '../services/favorites.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-meals',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent {
  private mealDb = inject(MealDbService);
  private favorites = inject(FavoritesService);
  searchTerm = '';
  meals: any[] = [];
  pagedMeals: any[] = [];
  pageSize = 12;
  page = 1;
  loading = false;
  error = '';
  categories: any[] = [];
  areas: any[] = [];
  ingredients: any[] = [];
  selectedCategory = '';
  selectedArea = '';
  selectedIngredient = '';
  selectedLetter = '';
  skeletons = Array(6);
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  popularMeals: any[] = [];

  constructor() {
    this.fetchCategoriesAndAreasAndIngredients();
    this.searchMeals();
    this.fetchPopularMeals();
  }

  fetchCategoriesAndAreasAndIngredients() {
    this.mealDb.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.categories || [];
      }
    });
    this.mealDb.getAreas().subscribe({
      next: (res: any) => {
        this.areas = res.meals || [];
      }
    });
    this.mealDb.getIngredients().subscribe({
      next: (res: any) => {
        this.ingredients = res.meals || [];
      }
    });
  }

  searchMeals() {
    this.loading = true;
    this.error = '';
    this.selectedCategory = '';
    this.selectedArea = '';
    this.selectedIngredient = '';
    this.selectedLetter = '';
    this.mealDb.searchMeals(this.searchTerm).subscribe({
      next: (res: any) => {
        this.meals = res.meals || [];
        this.page = 1;
        this.updatePagedMeals();
        this.loading = false;
      },
      error: () => {
        this.error = 'Bir hata oluştu.';
        this.loading = false;
      }
    });
  }

  filterByCategory() {
    if (!this.selectedCategory) {
      this.searchMeals();
      return;
    }
    this.loading = true;
    this.error = '';
    this.selectedArea = '';
    this.selectedIngredient = '';
    this.selectedLetter = '';
    this.mealDb.getMealsByCategory(this.selectedCategory).subscribe({
      next: (res: any) => {
        this.meals = res.meals || [];
        this.page = 1;
        this.updatePagedMeals();
        this.loading = false;
      },
      error: () => {
        this.error = 'Bir hata oluştu.';
        this.loading = false;
      }
    });
  }

  filterByArea() {
    if (!this.selectedArea) {
      this.searchMeals();
      return;
    }
    this.loading = true;
    this.error = '';
    this.selectedCategory = '';
    this.selectedIngredient = '';
    this.selectedLetter = '';
    this.mealDb.getMealsByArea(this.selectedArea).subscribe({
      next: (res: any) => {
        this.meals = res.meals || [];
        this.page = 1;
        this.updatePagedMeals();
        this.loading = false;
      },
      error: () => {
        this.error = 'Bir hata oluştu.';
        this.loading = false;
      }
    });
  }

  filterByIngredient() {
    if (!this.selectedIngredient) {
      this.searchMeals();
      return;
    }
    this.loading = true;
    this.error = '';
    this.selectedCategory = '';
    this.selectedArea = '';
    this.selectedLetter = '';
    this.mealDb.getMealsByIngredient(this.selectedIngredient).subscribe({
      next: (res: any) => {
        this.meals = res.meals || [];
        this.page = 1;
        this.updatePagedMeals();
        this.loading = false;
      },
      error: () => {
        this.error = 'Bir hata oluştu.';
        this.loading = false;
      }
    });
  }

  filterByLetter(letter: string) {
    this.loading = true;
    this.error = '';
    this.selectedCategory = '';
    this.selectedArea = '';
    this.selectedIngredient = '';
    this.selectedLetter = letter;
    this.mealDb.searchMeals(letter).subscribe({
      next: (res: any) => {
        this.meals = (res.meals || []).filter((m: any) => m.strMeal.startsWith(letter));
        this.page = 1;
        this.updatePagedMeals();
        this.loading = false;
      },
      error: () => {
        this.error = 'Bir hata oluştu.';
        this.loading = false;
      }
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedArea = '';
    this.selectedIngredient = '';
    this.selectedLetter = '';
    this.searchMeals();
  }

  updatePagedMeals() {
    this.pagedMeals = this.meals.slice(0, this.page * this.pageSize);
  }

  loadMore() {
    this.page++;
    this.updatePagedMeals();
  }

  isFavorite(mealId: string): boolean {
    return this.favorites.isFavorite(mealId);
  }

  toggleFavorite(mealId: string): void {
    this.favorites.toggleFavorite(mealId);
  }

  fetchPopularMeals() {
    // Popüler yemekler için rastgele 3 yemek çekiyoruz (API'de gerçek popüler endpoint yok)
    this.popularMeals = [];
    for (let i = 0; i < 3; i++) {
      this.mealDb.getRandomMeal().subscribe({
        next: (res: any) => {
          if (res.meals && res.meals.length > 0) {
            this.popularMeals.push(res.meals[0]);
          }
        }
      });
    }
  }
} 
 