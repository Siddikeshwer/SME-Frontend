// src/app/features/sme/response-portal/sme-response-portal.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CohortService } from '../../../core/services/cohort.service';

@Component({
  selector: 'app-sme-response-portal',
  templateUrl: './sme-response-portal.component.html',
  styleUrls: ['./sme-response-portal.component.scss']
})
export class SmeResponsePortalComponent implements OnInit {
  token = '';
  request: any = null;
  loading = true;
  submitting = false;
  responded = false;
  responseResult = '';
  errorMsg = '';

  preferredDate = new FormControl('', Validators.required);
  declineReason = new FormControl('');
  selectedDecision: 'ACCEPT' | 'DECLINE' | '' = '';

  constructor(
    private route: ActivatedRoute,
    private cohortService: CohortService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    if (!this.token) { this.errorMsg = 'Invalid response link.'; this.loading = false; return; }
    this.cohortService.getResponseByToken(this.token).subscribe({
      next: (data) => { this.request = data; this.loading = false; },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.error ?? 'This link is invalid or has expired.';
      }
    });
  }

  accept(): void { this.selectedDecision = 'ACCEPT'; }
  decline(): void { this.selectedDecision = 'DECLINE'; }

  submit(): void {
    if (this.selectedDecision === 'ACCEPT' && !this.preferredDate.value) {
      this.snack.open('Please select your preferred date', 'Close', { duration: 3000 }); return;
    }
    this.submitting = true;
    this.cohortService.submitResponse({
      token: this.token,
      decision: this.selectedDecision,
      preferredDate: this.preferredDate.value ?? undefined,
      declineReason: this.declineReason.value ?? undefined
    }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.responded = true;
        this.responseResult = this.selectedDecision;
        this.snack.open(res.message, 'Close', { duration: 5000 });
      },
      error: (err) => {
        this.submitting = false;
        this.snack.open(err.error?.error ?? 'Submission failed', 'Close', { duration: 4000 });
      }
    });
  }

  back(): void { this.selectedDecision = ''; }
}
