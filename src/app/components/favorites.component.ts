import { Component, inject } from '@angular/core';
import { FavoritesService } from '../services/favorites.service';
import { MealDbService } from '../services/mealdb.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  private favorites = inject(FavoritesService);
  private mealDb = inject(MealDbService);
  private router = inject(Router);
  favoriteMeals: any[] = [];
  loading = false;
  error = '';
  selectedMealIds: string[] = [];
  groupByCategory = false;
  noteInputs: Record<string, string> = {};
  notes: Record<string, string> = {};
  editingNoteId: string | null = null;

  constructor() {
    this.fetchFavorites();
    this.loadNotes();
  }

  fetchFavorites() {
    this.loading = true;
    const favIds = this.favorites.getFavorites();
    this.favoriteMeals = [];
    this.selectedMealIds = [];
    if (favIds.length === 0) {
      this.loading = false;
      return;
    }
    let loaded = 0;
    favIds.forEach(id => {
      this.mealDb.getMealById(id).subscribe({
        next: (res: any) => {
          if (res.meals && res.meals.length > 0) {
            this.favoriteMeals.push(res.meals[0]);
          }
          loaded++;
          if (loaded === favIds.length) this.loading = false;
        },
        error: () => {
          loaded++;
          if (loaded === favIds.length) this.loading = false;
        }
      });
    });
  }

  removeFavorite(mealId: string) {
    this.favorites.removeFavorite(mealId);
    this.fetchFavorites();
  }

  toggleSelectMeal(mealId: string) {
    const idx = this.selectedMealIds.indexOf(mealId);
    if (idx > -1) {
      this.selectedMealIds.splice(idx, 1);
    } else {
      this.selectedMealIds.push(mealId);
    }
  }

  removeSelectedFavorites() {
    this.selectedMealIds.forEach(id => this.favorites.removeFavorite(id));
    this.selectedMealIds = [];
    this.fetchFavorites();
  }

  goToDetail(mealId: string) {
    this.router.navigate(['/meals', mealId]);
  }

  getMostPopularCategory(): string {
    if (!this.favoriteMeals.length) return '-';
    const counts: Record<string, number> = {};
    this.favoriteMeals.forEach(meal => {
      counts[meal.strCategory] = (counts[meal.strCategory] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || '-';
  }

  getLastAddedMealName(): string {
    if (!this.favoriteMeals.length) return '-';
    // Son eklenen favori listenin sonundadır
    return this.favoriteMeals[this.favoriteMeals.length - 1].strMeal;
  }

  getCategoryGroups() {
    const groups: { category: string, meals: any[] }[] = [];
    const map: Record<string, any[]> = {};
    this.favoriteMeals.forEach(meal => {
      if (!map[meal.strCategory]) map[meal.strCategory] = [];
      map[meal.strCategory].push(meal);
    });
    Object.keys(map).forEach(cat => {
      groups.push({ category: cat, meals: map[cat] });
    });
    return groups;
  }

  // Notlar
  loadNotes() {
    const saved = localStorage.getItem('favoriteNotes');
    this.notes = saved ? JSON.parse(saved) : {};
  }

  saveNotesToStorage() {
    localStorage.setItem('favoriteNotes', JSON.stringify(this.notes));
  }

  getNote(mealId: string): string {
    return this.notes[mealId] || '';
  }

  saveNote(mealId: string) {
    const noteText = this.noteInputs[mealId];
    if (noteText !== undefined && noteText !== null) {
      const trimmed = noteText.trim();
      if (trimmed) {
        this.notes[mealId] = trimmed;
        this.saveNotesToStorage();
        console.log('Not kaydedildi:', mealId, trimmed);
      } else {
        // Boş not ise sil
        delete this.notes[mealId];
        this.saveNotesToStorage();
        console.log('Not silindi:', mealId);
      }
    }
    this.noteInputs[mealId] = '';
    this.editingNoteId = null;
  }

  editNote(mealId: string) {
    this.editingNoteId = mealId;
    this.noteInputs[mealId] = this.getNote(mealId);
    console.log('Not düzenleme başlatıldı:', mealId);
  }

  cancelEditNote(mealId: string) {
    this.editingNoteId = null;
    this.noteInputs[mealId] = '';
    console.log('Not düzenleme iptal edildi:', mealId);
  }

  deleteNote(mealId: string) {
    delete this.notes[mealId];
    this.saveNotesToStorage();
    this.editingNoteId = null;
    this.noteInputs[mealId] = '';
    console.log('Not silindi:', mealId);
  }
} 
 