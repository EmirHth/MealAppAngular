import { Component, inject, OnInit } from '@angular/core';
import { MealDbService } from '../services/mealdb.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-report-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-wizard.component.html',
  styleUrls: ['./report-wizard.component.css']
})
export class ReportWizardComponent implements OnInit {
  private mealDb = inject(MealDbService);
  meals: any[] = [];
  selectedMealId: string = '';
  selectedMeal: any = null;
  analysis: any = null;
  loading = false;
  error = '';

  // Wizard state
  step = 1;
  analysisType: string = '';
  extraParams: { [key: string]: any } = {};
  wizardStateKey = 'reportWizardState';

  // Report history (dummy data for now)
  reportHistory = [
    {
      date: '2024-05-01',
      title: 'Karnıyarık Analizi',
      analysis: {
        'Yemek Adı': 'Karnıyarık',
        'Kategori': 'Et',
        'Bölge': 'Türk',
        'Tarif': 'Patlıcan ve kıyma ile yapılan geleneksel Türk yemeği.'
      },
      template: 'short'
    },
    {
      date: '2024-04-28',
      title: 'Tiramisu Analizi',
      analysis: {
        'Yemek Adı': 'Tiramisu',
        'Kategori': 'Tatlı',
        'Bölge': 'İtalyan',
        'Tarif': 'Kahve ve mascarpone ile yapılan İtalyan tatlısı.'
      },
      template: 'detailed'
    },
    {
      date: '2024-04-25',
      title: 'Sushi Analizi',
      analysis: {
        'Yemek Adı': 'Sushi',
        'Kategori': 'Deniz Ürünleri',
        'Bölge': 'Japon',
        'Tarif': 'Pirinç ve çiğ balık ile yapılan Japon yemeği.'
      },
      template: 'ingredient'
    }
  ];
  selectedHistory: any = null;
  showHistoryModal = false;

  // Template selection
  templates = [
    { key: 'short', name: 'Kısa Analiz', desc: 'APA formatında kısa özet, başlık, tarih ve temel bilgiler.' },
    { key: 'detailed', name: 'Detaylı Analiz', desc: 'APA formatında başlık, özet, detaylı açıklama, anahtar kelimeler ve kaynakça.' },
    { key: 'ingredient', name: 'Malzeme Odaklı', desc: 'APA formatında başlık, malzeme listesi, miktarlar ve kısa açıklama.' }
  ];
  selectedTemplate: string = '';

  // APA preview
  get apaPreview(): string {
    // Use current analysis or dummy if not available
    const analysis = this.analysis || {
      'Yemek Adı': 'Örnek Yemek',
      'Kategori': 'Örnek Kategori',
      'Bölge': 'Örnek Bölge',
      'Tarif': 'Örnek açıklama...',
      'Malzemeler': 'Patates - 2 adet, Soğan - 1 adet, Tuz - 1 çay kaşığı',
      'Malzeme Sayısı': '3',
      'Açıklama': 'Örnek açıklama...',
      'Anahtar Kelimeler': 'örnek, analiz, yemek',
      'Kaynakça': 'Kaynak 1, Kaynak 2'
    };
    const template = this.templates.find(t => t.key === this.selectedTemplate) || this.templates[0];
    let content = '';
    content += `<div style='font-family: Times New Roman, serif; color:#222; max-width:600px; margin:0 auto;'>`;
    content += `<h2 style='text-align:center;'>${this.extraParams['title'] || 'Yemek Analiz Raporu'}</h2>`;
    content += `<div style='text-align:center; font-size:1.1em; margin-bottom:8px;'>${this.extraParams['date'] || 'Tarih: ...'}</div>`;
    if (template.key === 'short') {
      content += `<b>Yemek Adı:</b> ${analysis['Yemek Adı']}<br/>`;
      content += `<b>Kategori:</b> ${analysis['Kategori']}<br/>`;
      content += `<b>Bölge:</b> ${analysis['Bölge']}<br/>`;
      content += `<b>Tarif:</b> ${analysis['Tarif'] || ''}<br/>`;
    } else if (template.key === 'detailed') {
      content += `<b>Yemek Adı:</b> ${analysis['Yemek Adı']}<br/>`;
      content += `<b>Kategori:</b> ${analysis['Kategori']}<br/>`;
      content += `<b>Bölge:</b> ${analysis['Bölge']}<br/>`;
      content += `<b>Detaylı Açıklama:</b> ${analysis['Tarif'] || analysis['Açıklama'] || ''}<br/>`;
      content += `<b>Anahtar Kelimeler:</b> ${this.extraParams['keywords'] || analysis['Anahtar Kelimeler'] || '...' }<br/>`;
      content += `<b>Kaynakça:</b> ${this.extraParams['references'] || analysis['Kaynakça'] || '...' }<br/>`;
    } else if (template.key === 'ingredient') {
      content += `<b>Yemek Adı:</b> ${analysis['Yemek Adı']}<br/>`;
      content += `<b>Kategori:</b> ${analysis['Kategori']}<br/>`;
      content += `<b>Bölge:</b> ${analysis['Bölge']}<br/>`;
      content += `<b>Malzemeler:</b> ${analysis['Malzemeler'] || '...' }<br/>`;
      content += `<b>Malzeme Sayısı:</b> ${analysis['Malzeme Sayısı'] || '...' }<br/>`;
      content += `<b>Açıklama:</b> ${analysis['Açıklama'] || analysis['Tarif'] || '...' }<br/>`;
    }
    content += `</div>`;
    return content;
  }

  getTemplateDesc(key: string): string {
    const tpl = this.templates.find(t => t.key === key);
    return tpl ? tpl.desc : '';
  }

  getTemplateExample(key: string): string {
    if (key === 'short') {
      return `
        <div style='font-family: Times New Roman,serif; max-width:500px; margin:0 auto; background:#fff; border-radius:10px; box-shadow:0 2px 8px #0001; padding:24px;'>
          <h2 style='text-align:center; margin-bottom:8px;'>Kısa Analiz Raporu</h2>
          <div style='text-align:center; color:#888; margin-bottom:12px;'>11.11.1999</div>
          <b>Yemek Adı:</b> Örnek Yemek<br/>
          <b>Kategori:</b> Örnek Kategori<br/>
          <b>Bölge:</b> Örnek Bölge<br/>
          <b>Tarif:</b> Kısa açıklama...<br/>
        </div>
      `;
    } else if (key === 'detailed') {
      return `
        <div style='font-family: Times New Roman,serif; max-width:500px; margin:0 auto; background:#fff; border-radius:10px; box-shadow:0 2px 8px #0001; padding:24px;'>
          <h2 style='text-align:center; margin-bottom:8px;'>Detaylı Analiz Raporu</h2>
          <div style='text-align:center; color:#888; margin-bottom:12px;'>11.11.1999</div>
          <b>Yemek Adı:</b> Örnek Yemek<br/>
          <b>Kategori:</b> Örnek Kategori<br/>
          <b>Bölge:</b> Örnek Bölge<br/>
          <b>Detaylı Açıklama:</b> Uzun açıklama...<br/>
          <b>Anahtar Kelimeler:</b> örnek, analiz, yemek<br/>
          <b>Kaynakça:</b> Kaynak 1, Kaynak 2<br/>
        </div>
      `;
    } else if (key === 'ingredient') {
      return `
        <div style='font-family: Times New Roman,serif; max-width:500px; margin:0 auto; background:#fff; border-radius:10px; box-shadow:0 2px 8px #0001; padding:24px;'>
          <h2 style='text-align:center; margin-bottom:8px;'>Malzeme Odaklı Analiz Raporu</h2>
          <div style='text-align:center; color:#888; margin-bottom:12px;'>11.11.1999</div>
          <b>Yemek Adı:</b> Örnek Yemek<br/>
          <b>Kategori:</b> Örnek Kategori<br/>
          <b>Bölge:</b> Örnek Bölge<br/>
          <b>Malzemeler:</b> Patates - 2 adet, Soğan - 1 adet, Tuz - 1 çay kaşığı<br/>
          <b>Malzeme Sayısı:</b> 3<br/>
          <b>Açıklama:</b> Malzeme odaklı açıklama...<br/>
        </div>
      `;
    }
    return '';
  }

  ngOnInit() {
    this.fetchMeals();
    this.loadHistoryFromStorage();
    this.restoreState();
    // Modal export event listeners
    window.addEventListener('modalExportPDF', () => {
      if (this.selectedHistory) this.exportPDF(this.selectedHistory.analysis);
    });
    window.addEventListener('modalExportDOC', () => {
      if (this.selectedHistory) this.exportDOC(this.selectedHistory.analysis);
    });
  }

  fetchMeals() {
    this.loading = true;
    this.mealDb.searchMeals('').subscribe({
      next: (res: any) => {
        this.meals = res.meals || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Yemekler alınamadı.';
        this.loading = false;
      }
    });
  }

  // Wizard navigation
  nextStep() {
    if (this.step === 1 && !this.selectedMealId) {
      this.error = 'Lütfen bir yemek seçin.';
      return;
    }
    if (this.step === 2 && !this.analysisType) {
      this.error = 'Lütfen analiz türü seçin.';
      return;
    }
    this.error = '';
    this.step++;
    this.saveState();
    if (this.step === 2) this.onMealSelect();
    if (this.step === 3) this.prepareAnalysis();
    // Analiz Sonucu adımına gelindiğinde geçmişe ekle
    if (this.step === 4 && this.analysis) {
      const newHistory = {
        date: this.extraParams['date'] || new Date().toISOString().slice(0, 10),
        title: this.extraParams['title'] || 'Yemek Analizi',
        analysis: { ...this.analysis },
        template: this.selectedTemplate || ''
      };
      // Aynı başlık ve tarih ile tekrar eklenmesin
      const exists = this.reportHistory.some(h => h.title === newHistory.title && h.date === newHistory.date);
      if (!exists) {
        this.reportHistory.unshift(newHistory);
        this.saveHistoryToStorage();
      }
    }
  }
  prevStep() {
    if (this.step > 1) {
      this.step--;
      this.error = '';
      this.saveState();
    }
  }

  // State persistence
  saveState() {
    const state = {
      step: this.step,
      selectedMealId: this.selectedMealId,
      analysisType: this.analysisType,
      extraParams: this.extraParams
    };
    localStorage.setItem(this.wizardStateKey, JSON.stringify(state));
  }
  restoreState() {
    const data = localStorage.getItem(this.wizardStateKey);
    if (data) {
      const state = JSON.parse(data);
      this.step = state.step || 1;
      this.selectedMealId = state.selectedMealId || '';
      this.analysisType = state.analysisType || '';
      this.extraParams = state.extraParams || {};
      if (this.selectedMealId) this.onMealSelect();
      if (this.step === 3) this.prepareAnalysis();
    }
  }

  saveHistoryToStorage() {
    localStorage.setItem('reportHistory', JSON.stringify(this.reportHistory));
  }
  loadHistoryFromStorage() {
    const data = localStorage.getItem('reportHistory');
    if (data) {
      this.reportHistory = JSON.parse(data);
    }
  }

  // Step 1: Meal selection
  onMealSelect() {
    if (!this.selectedMealId) return;
    this.loading = true;
    this.mealDb.getMealById(this.selectedMealId).subscribe({
      next: (res: any) => {
        if (res.meals && res.meals.length > 0) {
          this.selectedMeal = res.meals[0];
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Yemek detayı alınamadı.';
        this.loading = false;
      }
    });
  }

  // Step 2: Analysis options (dynamic fields)
  analysisTypes = [
    { value: 'basic', label: 'Temel Analiz' },
    { value: 'ingredients', label: 'Malzeme Analizi' },
    { value: 'custom', label: 'Özel Analiz' }
  ];

  // Step 3: Prepare analysis result
  prepareAnalysis() {
    if (!this.selectedMeal) return;
    let result: any = {
      'Yemek Adı': this.selectedMeal.strMeal,
      'Kategori': this.selectedMeal.strCategory,
      'Bölge': this.selectedMeal.strArea
    };
    if (this.analysisType === 'basic') {
      result['Tarif'] = this.selectedMeal.strInstructions;
    } else if (this.analysisType === 'ingredients') {
      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ing = this.selectedMeal[`strIngredient${i}`];
        const measure = this.selectedMeal[`strMeasure${i}`];
        if (ing && ing.trim()) {
          ingredients.push(measure ? `${ing} - ${measure}` : ing);
        }
      }
      result['Malzeme Sayısı'] = ingredients.length;
      result['Malzemeler'] = ingredients.join(', ');
    } else if (this.analysisType === 'custom') {
      result['Açıklama'] = this.extraParams['customNote'] || '';
    }
    this.analysis = result;
    this.saveState();
  }

  // Template selection handler
  selectTemplate(key: string) {
    this.selectedTemplate = key;
    // Optionally reset analysis type or extra params
    if (key === 'short') this.analysisType = 'basic';
    else if (key === 'detailed') this.analysisType = 'custom';
    else if (key === 'ingredient') this.analysisType = 'ingredients';
  }

  // History modal handler
  openHistoryModal(item: any) {
    this.selectedHistory = item;
    this.showHistoryModal = true;
  }
  closeHistoryModal() {
    this.selectedHistory = null;
    this.showHistoryModal = false;
  }

  // Export methods (PDF, JSON, DOC) - APA and Turkish support
  exportPDF(analysisObj: any = null) {
    const analysis = analysisObj || this.analysis;
    if (!analysis) return;
    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    doc.setFont('helvetica', 'normal');
    let y = 60;
    doc.setFontSize(18);
    doc.text(this.extraParams['title'] || 'Yemek Analiz Raporu', 40, y);
    y += 24;
    doc.setFontSize(12);
    doc.text(`Tarih: ${this.extraParams['date'] || '...'}`, 40, y);
    y += 18;
    doc.setFontSize(11);
    Object.entries(analysis).forEach(([key, value]) => {
      if (typeof value === 'string' && value.length > 100) {
        doc.text(`${key}:`, 40, y);
        y += 14;
        doc.setFontSize(10);
        doc.text(doc.splitTextToSize(value, 480), 40, y);
        y += Math.ceil(value.length / 90) * 14;
        doc.setFontSize(11);
      } else {
        doc.text(`${key}: ${value}`, 40, y);
        y += 14;
      }
    });
    y += 18;
    doc.setFontSize(10);
    // doc.text('APA Formatında Otomatik Oluşturulmuştur', 40, y); // KALDIRILDI
    doc.save('yemek-analiz-raporu.pdf');
  }

  exportJSON() {
    if (!this.analysis) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.analysis, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'yemek-analiz-raporu.json');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  exportDOC(analysisObj: any = null) {
    const analysis = analysisObj || this.analysis;
    if (!analysis) return;
    let docContent = `${this.extraParams['title'] || 'Yemek Analiz Raporu'}\n`;
    docContent += `Tarih: ${this.extraParams['date'] || '...'}\n`;
    Object.entries(analysis).forEach(([key, value]) => {
      docContent += `${key}: ${value}\n`;
    });
    // docContent += '\nAPA Formatında Otomatik Oluşturulmuştur'; // KALDIRILDI
    const utf8BOM = '\uFEFF';
    const blob = new Blob([utf8BOM + docContent], { type: 'application/msword;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yemek-analiz-raporu.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // Modern modal HTML for history details
  getHistoryModalHTML(): string {
    if (!this.selectedHistory) return '';
    const a = this.selectedHistory.analysis;
    return `
      <div style='font-family: Poppins, Arial, sans-serif; max-width: 420px; margin:0 auto; background:#fff; border-radius:12px; box-shadow:0 2px 12px #0002; padding:24px;'>
        <h2 style='text-align:center; color:#FF7E1B; margin-bottom:8px;'>${this.selectedHistory.title}</h2>
        <div style='text-align:center; color:#5BC0EB; margin-bottom:12px;'>Tarih: ${this.selectedHistory.date}</div>
        <div style='display:grid; grid-template-columns: 1fr 2fr; gap:8px 12px; margin-bottom:18px;'>
          <div style='font-weight:600;'>Bölge</div><div>${a['Bölge'] || '-'}</div>
          <div style='font-weight:600;'>Kategori</div><div>${a['Kategori'] || '-'}</div>
          <div style='font-weight:600;'>Tarif</div><div>${a['Tarif'] || '-'}</div>
          <div style='font-weight:600;'>Yemek Adı</div><div>${a['Yemek Adı'] || '-'}</div>
        </div>
        <div style='display:flex; gap:12px; justify-content:flex-end; margin-top:18px;'>
          <button style='background:#FF7E1B; color:#fff; border:none; border-radius:6px; padding:8px 18px; font-weight:600; cursor:pointer;' onclick="window.dispatchEvent(new CustomEvent('modalExportPDF'))">PDF İndir</button>
          <button style='background:#5BC0EB; color:#fff; border:none; border-radius:6px; padding:8px 18px; font-weight:600; cursor:pointer;' onclick="window.dispatchEvent(new CustomEvent('modalExportDOC'))">DOC İndir</button>
        </div>
      </div>
    `;
  }
} 