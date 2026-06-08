import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { CohortService } from '../../../../core/services/cohort.service';
import { SmeService } from '../../../../core/services/sme.service';
import { SmeSummary } from '../../../../shared/models';

@Component({
  selector: 'app-create-cohort',
  templateUrl: './create-cohort.component.html',
  styleUrls: ['./create-cohort.component.scss']
})
export class CreateCohortComponent implements OnInit {
  step1Form!: FormGroup;
  specialties: string[] = [];
  separatorKeys = [ENTER, COMMA];

  availableSmes: SmeSummary[] = [];
  loadingSmes   = false;
  submitting    = false;

  // ── FIX: Use a plain number[] array instead of Set<number>
  // Angular's change detection checks REFERENCE equality on objects.
  // Set.add() / Set.delete() mutate the same object — Angular never sees a change,
  // so [disabled]="!canSubmit()" never re-evaluates and the button stays greyed out.
  // A new array reference on every toggle forces Angular to re-evaluate all bindings.
  selectedSmeIds: number[] = [];

  specialtyPresets = ['Java','Python','.NET','React','Angular','Cloud','DevOps','QA','Testing','AI/ML'];
  modeOptions      = ['Virtual','On-site','Hybrid'];
  priorityOptions  = [
    { value: 'HIGH',   label: 'High'   },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW',    label: 'Low'    }
  ];

  constructor(
    private fb:            FormBuilder,
    private cohortService: CohortService,
    private smeService:    SmeService,
    private router:        Router,
    private snack:         MatSnackBar
  ) {}

  ngOnInit(): void {
    this.step1Form = this.fb.group({
      evaluationType:    ['', Validators.required],
      smesRequired:      [1, [Validators.required, Validators.min(1)]],
      participantCount:  [1, [Validators.required, Validators.min(1)]],
      preferredDateFrom: ['', Validators.required],
      preferredDateTo:   ['', Validators.required],
      slotDuration:      ['60 minutes', Validators.required],
      mode:              ['Virtual', Validators.required],
      priority:          ['MEDIUM'],
      notes:             ['']
    });
  }

  // ── Specialties ───────────────────────────────────────────────────────────
  addSpecialty(event: MatChipInputEvent): void {
    const val = (event.value || '').trim();
    if (val && !this.specialties.includes(val)) {
      this.specialties = [...this.specialties, val]; // new reference
      this.loadMatchingSmes();
    }
    event.chipInput!.clear();
  }

  addPreset(spec: string): void {
    if (!this.specialties.includes(spec)) {
      this.specialties = [...this.specialties, spec]; // new reference
      this.loadMatchingSmes();
    }
  }

  removeSpecialty(spec: string): void {
    this.specialties = this.specialties.filter(s => s !== spec);
    this.loadMatchingSmes();
  }

  // ── SME loading ───────────────────────────────────────────────────────────
  loadMatchingSmes(): void {
    if (!this.specialties.length) {
      this.availableSmes  = [];
      this.selectedSmeIds = [];
      return;
    }
    this.loadingSmes = true;
    this.smeService.findAvailableBySpecialties(this.specialties).subscribe({
      next: smes => {
        this.availableSmes  = smes;
        this.selectedSmeIds = this.selectedSmeIds.filter(id => smes.some(s => s.id === id));
        this.loadingSmes    = false;
      },
      error: (err) => {
        this.loadingSmes = false;
        this.snack.open(
          'Could not load SMEs: ' + (err?.error?.error ?? err?.message ?? err?.status ?? 'Unknown error'),
          'Close', { duration: 5000 }
        );
      }
    });
  }

  // ── SME selection — NEW ARRAY on every change so Angular detects it ───────
  toggleSme(id: number): void {
    if (this.selectedSmeIds.includes(id)) {
      this.selectedSmeIds = this.selectedSmeIds.filter(x => x !== id); // new array
    } else {
      this.selectedSmeIds = [...this.selectedSmeIds, id];               // new array
    }
  }

  isSelected(id: number): boolean { return this.selectedSmeIds.includes(id); }

  // ── Submit guard ──────────────────────────────────────────────────────────
  canSubmit(): boolean {
    return this.step1Form.valid
        && this.specialties.length > 0
        && this.selectedSmeIds.length > 0;  // .length on array (was .size on Set)
  }

  submit(): void {
    if (!this.canSubmit()) {
      this.snack.open('Please complete the form and select at least 1 SME', 'Close', { duration: 4000 });
      return;
    }
    this.submitting = true;
    const f = this.step1Form.value;
    this.cohortService.createRequest({
      evaluationType:      f.evaluationType,
      requiredSpecialties: this.specialties,
      smesRequired:        f.smesRequired,
      participantCount:    f.participantCount,
      preferredDateFrom:   f.preferredDateFrom,
      preferredDateTo:     f.preferredDateTo,
      slotDuration:        f.slotDuration,
      mode:                f.mode,
      priority:            f.priority,
      notes:               f.notes,
      proposedSmeIds:      this.selectedSmeIds
    }).subscribe({
      next: r => {
        this.snack.open(`Request ${r.cohortId} submitted for admin review!`, 'Close', { duration: 5000 });
        this.router.navigate(['/poc/cohorts']);
      },
      error: err => {
        this.submitting = false;
        this.snack.open(err.error?.error ?? 'Failed to submit', 'Close', { duration: 4000 });
      }
    });
  }
}
