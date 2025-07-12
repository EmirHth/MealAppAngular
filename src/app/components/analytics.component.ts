import { Component, inject } from '@angular/core';
import { MealDbService } from '../services/mealdb.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent {
  private mealDb = inject(MealDbService);
  selectedChartType: ChartType = 'bar';
  showCharts = false;
  chartOptions: ChartOptions = { 
    responsive: true, 
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        display: false
      },
      tooltip: {
        enabled: true
      }
    } 
  };

  categoryChart: any = { 
    labels: [], 
    datasets: [{ 
      data: [], 
      label: 'Kategori',
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
      ],
      borderColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
      ],
      borderWidth: 1
    }] 
  };
  
  areaChart: any = { 
    labels: [], 
    datasets: [{ 
      data: [], 
      label: 'Bölge',
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
      ],
      borderColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
      ],
      borderWidth: 1
    }] 
  };

  popularMealsChart: any = { 
    labels: [], 
    datasets: [{ 
      data: [], 
      label: 'Analiz Sayısı',
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
      ],
      borderColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
      ],
      borderWidth: 1
    }] 
  };

  constructor() {
    this.fetchCategoryStats();
    this.fetchAreaStats();
    this.fetchPopularMealsStats();
  }

  fetchCategoryStats() {
    this.mealDb.getCategories().subscribe({
      next: (res: any) => {
        const categories = res.categories || [];
        this.categoryChart.labels = categories.map((c: any) => c.strCategory);
        const requests = categories.map((c: any) => this.mealDb.getMealsByCategory(c.strCategory));
        Promise.all(requests.map((obs: any) => obs.toPromise())).then((results: any[]) => {
          // Her kategori için yemek sayısı
          this.categoryChart.datasets[0].data = results.map((r: any) => r.meals?.length || 0);
          // Renk dizisini dinamik olarak ayarla
          const colorPalette = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#C9CBCF', '#FF7E1B', '#5BC0EB', '#FF6F61',
            '#B39CD0', '#6B4226', '#F7C873', '#A1C349', '#E94F37',
            '#393E41', '#3F88C5', '#44BBA4', '#E94F37', '#F6F7EB'
          ];
          const needed = this.categoryChart.labels.length;
          this.categoryChart.datasets[0].backgroundColor = Array(needed).fill(0).map((_,i)=>colorPalette[i%colorPalette.length]);
          this.categoryChart.datasets[0].borderColor = this.categoryChart.datasets[0].backgroundColor;
        });
      }
    });
  }

  fetchAreaStats() {
    this.mealDb.getAreas().subscribe({
      next: (res: any) => {
        const areas = res.meals || [];
        this.areaChart.labels = areas.map((a: any) => a.strArea);
        const requests = areas.map((a: any) => this.mealDb.getMealsByArea(a.strArea));
        Promise.all(requests.map((obs: any) => obs.toPromise())).then((results: any[]) => {
          this.areaChart.datasets[0].data = results.map((r: any) => r.meals?.length || 0);
          // Renk dizisini dinamik olarak ayarla
          const colorPalette = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#C9CBCF', '#FF7E1B', '#5BC0EB', '#FF6F61',
            '#B39CD0', '#6B4226', '#F7C873', '#A1C349', '#E94F37',
            '#393E41', '#3F88C5', '#44BBA4', '#E94F37', '#F6F7EB'
          ];
          const needed = this.areaChart.labels.length;
          this.areaChart.datasets[0].backgroundColor = Array(needed).fill(0).map((_,i)=>colorPalette[i%colorPalette.length]);
          this.areaChart.datasets[0].borderColor = this.areaChart.datasets[0].backgroundColor;
        });
      }
    });
  }

  fetchPopularMealsStats() {
    // Simulated popular meals data
    this.popularMealsChart.labels = ['Karnıyarık', 'Tiramisu', 'Sushi', 'Pizza', 'Hamburger'];
    this.popularMealsChart.datasets[0].data = [12, 9, 7, 15, 11];
  }

  getCurrentChartData() {
    switch(this.selectedChartType) {
      case 'bar':
      case 'pie':
      case 'line':
        return this.categoryChart;
      default:
        return this.categoryChart;
    }
  }

  getChartTitle() {
    switch(this.selectedChartType) {
      case 'bar':
        return '📊 Bar Grafik';
      case 'pie':
        return '🥧 Pasta Grafik';
      case 'line':
        return '📈 Çizgi Grafik';
      default:
        return '📊 Bar Grafik';
    }
  }

  // Add a setter to reset showCharts when chart type changes
  setSelectedChartType(type: ChartType) {
    this.selectedChartType = type;
    this.showCharts = false;
  }
} 