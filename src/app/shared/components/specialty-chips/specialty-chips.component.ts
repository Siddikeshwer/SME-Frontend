// src/app/shared/components/specialty-chips/specialty-chips.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-specialty-chips',
  template: `
    <div class="chips-row">
      <span class="chip" *ngFor="let s of visible" [style.background]="getColor(s)">{{ s }}</span>
      <span class="chip extra" *ngIf="specialties.length > maxShow">+{{ specialties.length - maxShow }}</span>
    </div>`,
  styles: [`
    .chips-row { display:flex; flex-wrap:wrap; gap:4px; }
    .chip { display:inline-block; padding:1px 8px; border-radius:8px; font-size:10px; font-weight:600;
            color:#fff; white-space:nowrap; }
    .extra { background:#9BA8BB !important; }
  `]
})
export class SpecialtyChipsComponent {
  @Input() specialties: string[] = [];
  @Input() maxShow = 99;

  get visible(): string[] { return this.specialties.slice(0, this.maxShow); }

  private colorMap: Record<string,string> = {
    'Java':'#2A70B2', 'Python':'#1A7A3C', '.NET':'#6838A8', 'C#':'#6838A8',
    'React':'#1290B0', 'Angular':'#C22626', 'TypeScript':'#2A70B2',
    'Cloud':'#BE780E', 'DevOps':'#8E3CAC', 'QA':'#12987A', 'Testing':'#12987A',
    'AI/ML':'#1565C0', 'Docker':'#2A70B2', 'Kubernetes':'#1A6B9C',
    'Spring Boot':'#1A7A3C', 'AWS':'#BE780E',
  };

  getColor(s: string): string { return this.colorMap[s] ?? '#5C728C'; }
}
