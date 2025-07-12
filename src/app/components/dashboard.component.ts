import { Component, inject } from '@angular/core';
import { MealDbService } from '../services/mealdb.service';
import { FavoritesService } from '../services/favorites.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private mealDb = inject(MealDbService);
  private favoritesService = inject(FavoritesService);
  private router = inject(Router);
  
  totalMeals = '-';
  totalCategories = '-';
  totalAreas = '-';
  totalFavorites = 0;
  lastMeals: any[] = [];
  favoriteMeals: any[] = [];
  loading = true;
  error = '';
  skeletons = Array(3);
  
  // Category filtering
  selectedCategory: string = '';
  categoryMeals: any[] = [];
  showCategoryMeals = false;
  
  // Analysis details
  selectedAnalysis: any = null;
  showAnalysisDetails = false;

  constructor() {
    this.fetchStats();
    this.fetchFavorites();
    this.fetchLastMeals();
  }

  fetchStats() {
    this.loading = true;
    this.error = '';
    this.mealDb.getCategories().subscribe({
      next: (res: any) => {
        this.totalCategories = res.categories?.length ?? '-';
      },
      error: () => {
        this.error = 'Kategori verisi alınamadı.';
      }
    });
    this.mealDb.getAreas().subscribe({
      next: (res: any) => {
        this.totalAreas = res.meals?.length ?? '-';
      },
      error: () => {
        this.error = 'Bölge verisi alınamadı.';
      }
    });
    this.mealDb.getMealsByCategory('Beef').subscribe({
      next: (res: any) => {
        this.totalMeals = res.meals?.length ?? '-';
        this.loading = false;
      },
      error: () => {
        this.error = 'Yemek verisi alınamadı.';
        this.loading = false;
      }
    });
  }

  fetchFavorites() {
    const favIds = this.favoritesService.getFavorites();
    this.totalFavorites = favIds.length;
    this.favoriteMeals = [];
    favIds.slice(0, 3).forEach(id => {
      this.mealDb.getMealById(id).subscribe({
        next: (res: any) => {
          if (res.meals && res.meals.length > 0) {
            this.favoriteMeals.push(res.meals[0]);
          }
        }
      });
    });
  }

  fetchLastMeals() {
    // Son eklenen yemekler için rastgele 3 yemek çekiyoruz (API'de gerçek "son eklenen" endpoint yok)
    this.lastMeals = [];
    for (let i = 0; i < 3; i++) {
      this.mealDb.getRandomMeal().subscribe({
        next: (res: any) => {
          if (res.meals && res.meals.length > 0) {
            this.lastMeals.push(res.meals[0]);
          }
        }
      });
    }
  }

  // Navigation methods
  navigateToMeals() {
    this.router.navigate(['/meals']);
  }

  navigateToMealDetail(mealId: string) {
    this.router.navigate(['/meals', mealId]);
  }

  navigateToFavorites() {
    this.router.navigate(['/favorites']);
  }

  navigateToAnalytics() {
    this.router.navigate(['/analytics']);
  }

  // Category filtering
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.showCategoryMeals = true;
    this.categoryMeals = [];
    
    // Map category names to API category names
    const categoryMap: { [key: string]: string } = {
      'Et': 'Beef',
      'Tavuk': 'Chicken',
      'Tatlı': 'Dessert',
      'Vejetaryen': 'Vegetarian',
      'Deniz Ürünleri': 'Seafood',
      'Çorba': 'Soup'
    };
    
    const apiCategory = categoryMap[category] || category;
    
    this.mealDb.getMealsByCategory(apiCategory).subscribe({
      next: (res: any) => {
        if (res.meals) {
          this.categoryMeals = res.meals.slice(0, 6); // Show first 6 meals
        }
      },
      error: () => {
        this.error = 'Kategori yemekleri alınamadı.';
      }
    });
  }

  clearCategoryFilter() {
    this.selectedCategory = '';
    this.showCategoryMeals = false;
    this.categoryMeals = [];
  }

  // Analysis details
  showAnalysisDetail(analysis: any) {
    this.selectedAnalysis = analysis;
    this.showAnalysisDetails = true;
  }

  closeAnalysisDetails() {
    this.selectedAnalysis = null;
    this.showAnalysisDetails = false;
  }

  // Favorites management
  addToFavorites(meal: any) {
    this.favoritesService.addFavorite(meal.idMeal);
    this.fetchFavorites(); // Refresh favorites
  }

  removeFromFavorites(meal: any) {
    this.favoritesService.removeFavorite(meal.idMeal);
    this.fetchFavorites(); // Refresh favorites
  }

  isFavorite(mealId: string): boolean {
    return this.favoritesService.isFavorite(mealId);
  }
} 
 