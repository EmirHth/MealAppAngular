export interface Report {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  meals: string[]; // meal id listesi
  chartType: string;
  language: 'tr' | 'en';
  format: 'pdf' | 'docx';
  content: string;
} 