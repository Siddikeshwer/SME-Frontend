// src/app/shared/components/loading-spinner/loading-spinner.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div style="display:flex;justify-content:center;align-items:center;padding:40px">
      <mat-spinner diameter="40"></mat-spinner>
    </div>`
})
export class LoadingSpinnerComponent {}
