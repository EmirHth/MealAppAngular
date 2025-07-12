import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  // İstatistikler
  favoritesCount: number = 0;
  reportsCount: number = 0;
  notesCount: number = 0;
  daysActive: number = 0;

  constructor() {
    this.loadStatistics();
  }

  loadStatistics() {
    // Favoriler sayısı
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
      this.favoritesCount = JSON.parse(favorites).length;
    }

    // Notlar sayısı
    const notes = localStorage.getItem('favoriteNotes');
    if (notes) {
      this.notesCount = Object.keys(JSON.parse(notes)).length;
    }

    // Rapor sayısı (simüle edilmiş)
    this.reportsCount = Math.floor(Math.random() * 10) + 5;

    // Aktif gün sayısı (simüle edilmiş)
    this.daysActive = Math.floor(Math.random() * 30) + 15;
  }

  exportData() {
    const data = {
      favorites: localStorage.getItem('favorites'),
      favoriteNotes: localStorage.getItem('favoriteNotes'),
      exportDate: new Date().toISOString(),
      projectInfo: {
        name: 'Foodie Vibes',
        version: 'v1.0.0',
        developer: 'Emir Th',
        description: 'Modern yemek keşif uygulaması'
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `foodie-vibes-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const data = JSON.parse(e.target.result);
            
            if (data.favorites) localStorage.setItem('favorites', data.favorites);
            if (data.favoriteNotes) localStorage.setItem('favoriteNotes', data.favoriteNotes);
            
            this.loadStatistics();
            alert('Veriler başarıyla içe aktarıldı!');
          } catch (error) {
            alert('Dosya formatı geçersiz!');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  clearAllData() {
    if (confirm('Tüm veriler silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?')) {
      localStorage.removeItem('favorites');
      localStorage.removeItem('favoriteNotes');
      localStorage.removeItem('theme');
      localStorage.removeItem('language');
      localStorage.removeItem('notifications');
      localStorage.removeItem('autoSave');
      localStorage.removeItem('itemsPerPage');
      localStorage.removeItem('analysisLevel');
      localStorage.removeItem('reportFormat');
      
      this.loadStatistics();
      alert('Tüm veriler temizlendi!');
    }
  }
} 