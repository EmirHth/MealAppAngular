import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealDbService } from '../services/mealdb.service';
import { FavoritesService } from '../services/favorites.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-meal-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './meal-detail.component.html',
  styleUrls: ['./meal-detail.component.css']
})
export class MealDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mealDb = inject(MealDbService);
  private favorites = inject(FavoritesService);
  private sanitizer = inject(DomSanitizer);

  meal: any = null;
  ingredients: string[] = [];
  loading = true;
  error = '';
  similarMeals: any[] = [];
  comments: { user: string; text: string; date: Date }[] = [];
  newComment = '';
  rating = 0;
  userRating = 0;
  showShare = false;

  get pageUrl() {
    return window.location.href;
  }

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchMeal(id);
        this.loadComments(id);
        this.loadRating(id);
      } else {
        this.error = 'Yemek ID bulunamadı.';
        this.loading = false;
      }
    });
  }

  fetchMeal(id: string) {
    this.loading = true;
    this.error = '';
    this.mealDb.getMealById(id).subscribe({
      next: (res: any) => {
        if (res.meals && res.meals.length > 0) {
          this.meal = res.meals[0];
          this.ingredients = this.extractIngredients(this.meal);
          this.fetchSimilarMeals(this.meal.strCategory, this.meal.idMeal);
        } else {
          this.error = 'Yemek bulunamadı.';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Bir hata oluştu. Lütfen tekrar deneyin.';
        this.loading = false;
      }
    });
  }

  fetchSimilarMeals(category: string, excludeId: string) {
    this.mealDb.getMealsByCategory(category).subscribe({
      next: (res: any) => {
        this.similarMeals = (res.meals || []).filter((m: any) => m.idMeal !== excludeId).slice(0, 6);
      }
    });
  }

  extractIngredients(meal: any): string[] {
    const ings: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ing && ing.trim()) {
        ings.push(measure ? `${ing} - ${measure}` : ing);
      }
    }
    return ings;
  }

  isFavorite(mealId: string): boolean {
    return this.favorites.isFavorite(mealId);
  }

  toggleFavorite(mealId: string): void {
    this.favorites.toggleFavorite(mealId);
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert('Yemek linki kopyalandı!');
  }

  getYoutubeEmbedUrl(url: string): SafeResourceUrl {
    if (!url) return '';
    const videoId = url.split('v=')[1]?.split('&')[0];
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  goBack() {
    this.router.navigate(['/meals']);
  }

  // --- Yorumlar ---
  loadComments(mealId: string) {
    const key = `comments_${mealId}`;
    const data = localStorage.getItem(key);
    this.comments = data ? JSON.parse(data) : [];
  }

  addComment(mealId: string) {
    if (!this.newComment.trim()) return;
    const comment = { user: 'Kullanıcı', text: this.newComment, date: new Date() };
    this.comments.unshift(comment);
    localStorage.setItem(`comments_${mealId}`, JSON.stringify(this.comments));
    this.newComment = '';
  }

  // --- Puanlama ---
  loadRating(mealId: string) {
    const key = `rating_${mealId}`;
    const data = localStorage.getItem(key);
    this.rating = data ? Number(data) : 0;
    this.userRating = this.rating;
  }

  setRating(mealId: string, value: number) {
    this.rating = value;
    this.userRating = value;
    localStorage.setItem(`rating_${mealId}`, value.toString());
  }

  // --- Paylaşım ---
  toggleShare() {
    this.showShare = !this.showShare;
  }
} 
 