// src/app/features/admin/approval/approval-list/approval-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CohortService } from '../../../../core/services/cohort.service';
import { CohortRequest } from '../../../../shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.scss']
})
export class ApprovalListComponent implements OnInit {
  requests: CohortRequest[] = [];
  loading = false;
  activeTab = 'pending';

  constructor(
    private cohortService: CohortService,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    const obs = this.activeTab === 'pending'
      ? this.cohortService.getPendingRequests()
      : this.cohortService.getAllRequests();
    obs.subscribe({
      next: (d) => { this.requests = d; this.loading = false; },
      error: () => { this.loading = false; this.snack.open('Failed to load requests', 'Close', { duration: 3000 }); }
    });
  }

  switchTab(tab: string): void { this.activeTab = tab; this.load(); }
  viewDetail(id: number): void { this.router.navigate(['/admin/approvals', id]); }
}
