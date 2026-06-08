import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { CohortService } from '../../../../core/services/cohort.service';
import { CohortRequest, SmeSummary } from '../../../../shared/models';

@Component({
  selector: 'app-approval-detail',
  templateUrl: './approval-detail.component.html',
  styleUrls: ['./approval-detail.component.scss'],
  providers: [DatePipe]
})
export class ApprovalDetailComponent implements OnInit {
  request:       CohortRequest | null = null;
  loading    = true;
  submitting = false;
  adminNote  = new FormControl('');
  selectedSmeIds = new Set<number>();

  // ── FIX: field rows built in TS — no inline arrays with pipes in template ──
  fieldRows: { label: string; value: string }[] = [];

  constructor(
    private route:         ActivatedRoute,
    private router:        Router,
    private cohortService: CohortService,
    private snack:         MatSnackBar,
    private datePipe:      DatePipe
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cohortService.getRequestById(id).subscribe({
      next: r => {
        this.request = r;
        this.buildFieldRows(r);
        r.proposedSmes.forEach(s => {
          if (s.availabilityStatus === 'AVAILABLE' || s.availabilityStatus === 'PENDING') {
            this.selectedSmeIds.add(s.id);
          }
        });
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        const msg = err?.error?.error ?? err?.message ?? 'Failed to load request';
        this.snack.open(msg, 'Close', { duration: 4000 });
      }
    });
  }

  private buildFieldRows(r: CohortRequest): void {
    this.fieldRows = [
      { label: 'Submitted by',        value: `${r.pocName} (${r.pocEmail})` },
      { label: 'Specialties Required',value: r.requiredSpecialties.join(', ') },
      { label: 'SMEs Required',        value: `${r.smesRequired} experts` },
      { label: 'Participants',         value: `${r.participantCount} trainees` },
      { label: 'Date From',            value: this.datePipe.transform(r.preferredDateFrom, 'mediumDate') ?? '' },
      { label: 'Date To',              value: this.datePipe.transform(r.preferredDateTo,   'mediumDate') ?? '' },
      { label: 'Duration',             value: r.slotDuration },
      { label: 'Mode',                 value: r.mode },
      { label: 'Priority',             value: r.priority },
      { label: 'Submitted',            value: this.datePipe.transform(r.createdAt, 'medium') ?? '' },
    ];
    if (r.notes) {
      this.fieldRows.push({ label: 'Notes', value: r.notes });
    }
  }

  toggleSme(id: number): void {
    if (this.selectedSmeIds.has(id)) this.selectedSmeIds.delete(id);
    else this.selectedSmeIds.add(id);
  }

  isSelected(id: number): boolean   { return this.selectedSmeIds.has(id); }
  isConflict(sme: SmeSummary): boolean { return sme.availabilityStatus === 'BOOKED'; }

  decide(decision: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES'): void {
    if (!this.request) return;

    // ── INTEGRATED: Trigger Outlook client window when 'APPROVE' is clicked ──
    if (decision === 'APPROVE' && this.selectedSmeIds.size > 0) {
      
      // 1. Filter out the full info of the checked SMEs from your template data list
      const selectedSmes = this.request.proposedSmes.filter(sme => 
        this.selectedSmeIds.has(sme.id)
      );

      // 2. Extract their emails and separate them with a comma
      const emails = selectedSmes.map(sme => sme.email).join(';');

      // 3. Extract the first expert's specialty to use as a fallback role
      const commonRole = selectedSmes[0]?.specialties?.[0] || 'Evaluation';

      // 4. Structure your subject and body layouts with URI safe formatting
      const bulkSubject = encodeURIComponent(`Availability Inquiry: ${commonRole} Evaluations - ${this.request.cohortId}`);
      const bulkBody = encodeURIComponent(
        `Dear Experts,\n\n` +
        `We are reaching out to check your availability for upcoming ${commonRole} evaluation slots.\n\n` +
        `Please let us know if you have an open window in your schedule to assist with these sessions. We look forward to coordinating with you.\n\n` +
        `Best Regards,\n` +
        `SME Coordination Team`
      );

      // 5. Open Outlook window on your machine
      window.location.href = `mailto:${emails}?subject=${bulkSubject}&body=${bulkBody}`;
    }

    // ── Standard processing: Notify your MySQL database via Spring Boot ──
    this.submitting = true;
    this.cohortService.processDecision(this.request.id, {
      decision,
      adminNote:      this.adminNote.value || undefined,
      selectedSmeIds: decision === 'APPROVE' ? Array.from(this.selectedSmeIds) : undefined
    }).subscribe({
      next: () => {
        const msg = decision === 'APPROVE'
          ? '✅ Approved! Local Outlook window opened and database records updated.'
          : decision === 'REJECT' ? 'Request rejected.' : 'Changes requested sent to POC.';
        this.snack.open(msg, 'Close', { duration: 5000 });
        this.router.navigate(['/admin/approvals']);
      },
      error: err => {
        this.submitting = false;
        this.snack.open(err.error?.error ?? 'Action failed', 'Close', { duration: 4000 });
      }
    });
  }

  goBack(): void { this.router.navigate(['/admin/approvals']); }

  getAvailColor(s: string): string {
    const m: Record<string, string> = {
      AVAILABLE: '#1A8240', BOOKED: '#C22626', PENDING: '#BE780E', ON_HOLD: '#6838A8'
    };
    return m[s] ?? '#5C728C';
  }
}