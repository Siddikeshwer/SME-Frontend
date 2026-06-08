import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CohortService } from '../../../core/services/cohort.service';
import { CohortRequest } from '../../../shared/models';

@Component({
  selector: 'app-request-tracker',
  templateUrl: './request-tracker.component.html',
  styleUrls: ['./request-tracker.component.scss']
})
export class RequestTrackerComponent implements OnInit {
  request: CohortRequest | null = null;
  loading = true;

  pipelineStages = [
    { key: 'SUBMITTED',  label: 'Submitted',    icon: 'assignment' },
    { key: 'REVIEW',     label: 'Admin Review', icon: 'manage_search' },
    { key: 'APPROVED',   label: 'Approved',     icon: 'check_circle' },
    { key: 'PINGS',      label: 'Pings Sent',   icon: 'send' },
    { key: 'RESPONSES',  label: 'Responses',    icon: 'forum' },
    { key: 'CONFIRMED',  label: 'Confirmed',    icon: 'verified' },
  ];

  // FIX 3: Removed 'action' column — Re-ping is admin responsibility, not POC
  displayedColumns = ['num', 'name', 'pingSent', 'response', 'preferredDate', 'status'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cohortService: CohortService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRequest(id);
  }

  loadRequest(id: number): void {
    this.cohortService.getMyRequestById(id).subscribe({
      next: r => { this.request = r; this.loading = false; },
      error: () => { this.loading = false; this.snack.open('Failed to load tracker', 'Close', { duration: 3000 }); }
    });
  }

  getActiveStageIndex(status: string): number {
    const order: Record<string, number> = {
      SUBMITTED: 0, UNDER_REVIEW: 1, APPROVED: 2, CONFIRMED: 5, REJECTED: -1
    };
    return order[status] ?? 0;
  }

  getResponseStatusColor(s: string): string {
    const m: Record<string, string> = {
      ACCEPTED: '#1A8240', DECLINED: '#C22626', PENDING: '#BE780E', NO_RESPONSE: '#5C728C'
    };
    return m[s] ?? '#5C728C';
  }

  getResponseIcon(s: string): string {
    return { ACCEPTED: 'check_circle', DECLINED: 'cancel', PENDING: 'hourglass_empty', NO_RESPONSE: 'help_outline' }[s] ?? 'help_outline';
  }

  goBack(): void { this.router.navigate(['/poc/cohorts']); }
}
