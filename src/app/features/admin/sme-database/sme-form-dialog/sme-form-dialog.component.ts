// src/app/features/admin/sme-database/sme-form-dialog/sme-form-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { SmeService } from '../../../../core/services/sme.service';
import { Sme } from '../../../../shared/models';

@Component({
  selector: 'app-sme-form-dialog',
  templateUrl: './sme-form-dialog.component.html',
  styles: [`
    .dialog-header { background: #162030; color: #fff; padding: 20px 24px; border-radius: 4px 4px 0 0;
      display: flex; align-items: center; gap: 10px; justify-content: space-between;
      h3 { margin: 0; font-size: 17px; font-weight: 600; } }
    .dialog-body  { padding: 24px; overflow-y: auto; max-height: 60vh; }
    .form-grid    { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
    .full-span    { grid-column: 1 / -1; }
    .dialog-footer { padding: 16px 24px; display: flex; justify-content: flex-end; gap: 12px;
      border-top: 1px solid #DAE4F2; }
    .chips-container { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 0; }
    mat-form-field { width: 100%; }
  `]
})
export class SmeFormDialogComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEdit: boolean;
  specialties: string[] = [];
  separatorKeys = [ENTER, COMMA];

  availabilityOptions = ['AVAILABLE','ON_HOLD','INACTIVE'];
  specialtyPresets = ['Java','Python','.NET','C#','React','Angular','TypeScript','Cloud','DevOps','QA','Testing','AI/ML','Spring Boot','Docker','Kubernetes'];

  constructor(
    private fb: FormBuilder,
    private smeService: SmeService,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<SmeFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Sme | null
  ) {
    this.isEdit = !!data;
  }

  ngOnInit(): void {
    const d = this.data;
    this.specialties = d?.specialties ? [...d.specialties] : [];
    this.form = this.fb.group({
      fullName:          [d?.fullName ?? '',         Validators.required],
      email:             [d?.email ?? '',            [Validators.required, Validators.email]],
      department:        [d?.department ?? '',        Validators.required],
      designation:       [d?.designation ?? ''],
      yearsOfExperience: [d?.yearsOfExperience ?? '', [Validators.required, Validators.min(0)]],
      phone:             [d?.phone ?? ''],
      teamsId:           [d?.teamsId ?? '',           Validators.required],
      availabilityStatus:[d?.availabilityStatus ?? 'AVAILABLE'],
      bio:               [d?.bio ?? ''],
    });
  }

  addSpecialty(event: MatChipInputEvent): void {
    const val = (event.value || '').trim();
    if (val && !this.specialties.includes(val)) this.specialties.push(val);
    event.chipInput!.clear();
  }

  addPreset(spec: string): void {
    if (!this.specialties.includes(spec)) this.specialties.push(spec);
  }

  removeSpecialty(spec: string): void {
    this.specialties = this.specialties.filter(s => s !== spec);
  }

  submit(): void {
    if (this.form.invalid || !this.specialties.length) {
      this.snack.open('Please fill all required fields and add at least one specialty', 'Close', { duration: 4000 });
      return;
    }
    this.loading = true;
    const req = { ...this.form.value, specialties: this.specialties };
    const obs = this.isEdit ? this.smeService.update(this.data!.id, req) : this.smeService.create(req);
    obs.subscribe({
      next: () => {
        this.snack.open(this.isEdit ? 'SME updated' : 'SME added', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => { this.loading = false; this.snack.open(err.error?.error ?? 'Save failed', 'Close', { duration: 4000 }); }
    });
  }
}
