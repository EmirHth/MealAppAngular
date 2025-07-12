import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MealDbService {
  private http = inject(HttpClient);
  private baseUrl = 'https://www.themealdb.com/api/json/v1/1';

  // İsme göre yemek ara (boşsa tüm yemekler)
  searchMeals(name: string = ''): Observable<any> {
    return this.http.get(`${this.baseUrl}/search.php?s=${name}`);
  }

  // Belirli yemek ID'sine göre detay
  getMealById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/lookup.php?i=${id}`);
  }

  // Rastgele yemek
  getRandomMeal(): Observable<any> {
    return this.http.get(`${this.baseUrl}/random.php`);
  }

  // Tüm kategoriler
  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categories.php`);
  }

  // Kategoriye göre yemekler
  getMealsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/filter.php?c=${category}`);
  }

  // Tüm bölgeler
  getAreas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/list.php?a=list`);
  }

  // Bölgeye göre yemekler
  getMealsByArea(area: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/filter.php?a=${area}`);
  }

  // Tüm malzemeler
  getIngredients(): Observable<any> {
    return this.http.get(`${this.baseUrl}/list.php?i=list`);
  }

  // Malzemeye göre yemekler
  getMealsByIngredient(ingredient: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/filter.php?i=${ingredient}`);
  }
} 
 