import { Component } from '@angular/core';

@Component({
  selector: 'app-meal-detail',
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div class="bg-white rounded-lg shadow p-8 max-w-lg w-full">
        <h1 class="text-2xl font-bold mb-4 text-blue-700">Yemek Detayı</h1>
        <div class="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
        <h2 class="font-semibold text-xl mb-2">Yemek Adı</h2>
        <p class="text-gray-500 mb-2">Kategori</p>
        <p class="text-gray-500 mb-2">Bölge</p>
        <div class="mt-4 text-gray-700">Malzemeler ve tarif burada olacak.</div>
        <button class="mt-6 bg-blue-600 text-white px-4 py-2 rounded">Geri Dön</button>
      </div>
    </div>
  `
})
export class MealDetailComponent {} 