import { Component } from '@angular/core';

@Component({
  selector: 'app-meals',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gray-50 p-4">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-2xl font-bold mb-4 text-blue-700">Yemekler</h1>
        <div class="flex gap-2 mb-6">
          <input type="text" placeholder="Yemek ara..." class="flex-1 border rounded px-3 py-2" />
          <button class="bg-blue-600 text-white px-4 py-2 rounded">Ara</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <!-- Yemek kartları burada olacak -->
          <div class="bg-white rounded-lg shadow p-4 flex flex-col items-center" *ngFor="let meal of []">
            <div class="w-24 h-24 bg-gray-200 rounded-full mb-2"></div>
            <h2 class="font-semibold text-lg">Yemek Adı</h2>
            <p class="text-gray-500">Kategori</p>
            <button class="mt-2 text-blue-600 hover:underline">Detay</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MealsComponent {} 