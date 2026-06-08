import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CohortService } from '../../../core/services/cohort.service';
import { CohortRequest, AgentAnalysis } from '../../../shared/models';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface RequestWithAnalysis {
  request:  CohortRequest;
  analysis: AgentAnalysis | null;
  loading:  boolean;
}

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.scss']
})
export class AgentDashboardComponent implements OnInit {
  items: RequestWithAnalysis[] = [];
  loading = true;

  constructor(private cohortService: CohortService, private router: Router) {}

  ngOnInit(): void {
    this.cohortService.getPendingRequests().subscribe({
      next: requests => {
        this.items = requests.map(r => ({ request: r, analysis: null, loading: true }));
        this.loading = false;
        // Run agent analysis for each request in parallel
        requests.forEach((r, i) => {
          this.cohortService.getAgentAnalysis(r.id).pipe(
            catchError(() => of(null))
          ).subscribe(a => {
            this.items[i].analysis = a;
            this.items[i].loading  = false;
          });
        });
      },
      error: () => { this.loading = false; }
    });
  }

  viewDetail(id: number): void { this.router.navigate(['/admin/approvals', id]); }

  recColor(rec: string | undefined): string {
    return { APPROVE: '#1A8240', FLAG: '#BE780E', REJECT_RISK: '#C22626' }[rec ?? ''] ?? '#5C728C';
  }
  recIcon(rec: string | undefined): string {
    return { APPROVE: 'check_circle', FLAG: 'warning', REJECT_RISK: 'cancel' }[rec ?? ''] ?? 'hourglass_empty';
  }
  recLabel(rec: string | undefined): string {
    return { APPROVE: 'Approve', FLAG: 'Review First', REJECT_RISK: 'High Risk' }[rec ?? ''] ?? 'Analysing...';
  }
  scoreColor(s: number): string { return s >= 75 ? '#1A8240' : s >= 45 ? '#BE780E' : '#C22626'; }
}
