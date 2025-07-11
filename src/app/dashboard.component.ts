import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 class="text-3xl font-bold mb-6 text-blue-700">Yemek Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <div class="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span class="text-4xl">🍽️</span>
          <h2 class="text-lg font-semibold mt-2">Toplam Yemek</h2>
          <p class="text-2xl font-bold text-blue-600 mt-1">-</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span class="text-4xl">📂</span>
          <h2 class="text-lg font-semibold mt-2">Kategori</h2>
          <p class="text-2xl font-bold text-blue-600 mt-1">-</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span class="text-4xl">🌍</span>
          <h2 class="text-lg font-semibold mt-2">Bölge</h2>
          <p class="text-2xl font-bold text-blue-600 mt-1">-</p>
        </div>
      </div>
      <div class="mt-10 text-gray-500">TheMealDB API ile canlı veri yakında burada!</div>
    </div>
  `
})
export class DashboardComponent {} 