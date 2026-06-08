// src/app/features/poc/dashboard/poc-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CohortService } from '../../../core/services/cohort.service';
import { DashboardStats, CohortRequest } from '../../../shared/models';

@Component({
  selector: 'app-poc-dashboard',
  templateUrl: './poc-dashboard.component.html',
  styleUrls: ['./poc-dashboard.component.scss']
})
export class PocDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  cohorts: CohortRequest[] = [];
  loading = true;

  constructor(private cohortService: CohortService, private router: Router) {}

  ngOnInit(): void {
    this.cohortService.getPocDashboard().subscribe(s => { this.stats = s; });
    this.cohortService.getMyRequests().subscribe(c => { this.cohorts = c; this.loading = false; });
  }

  viewTracker(id: number): void { this.router.navigate(['/poc/tracker', id]); }
  newRequest(): void { this.router.navigate(['/poc/cohorts/new']); }

  getStatusColor(s: string): string {
    const m: Record<string,string> = { CONFIRMED:'#1A8240', APPROVED:'#2A70B2', SUBMITTED:'#BE780E', REJECTED:'#C22626', CHANGES_REQUESTED:'#6838A8' };
    return m[s] ?? '#5C728C';
  }
}
