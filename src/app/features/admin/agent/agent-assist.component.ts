import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CohortService } from '../../../core/services/cohort.service';
import { AgentAnalysis } from '../../../shared/models';

@Component({
  selector: 'app-agent-assist',
  templateUrl: './agent-assist.component.html',
  styleUrls: ['./agent-assist.component.scss']
})
export class AgentAssistComponent implements OnChanges {
  @Input() requestId!: number;

  analysis: AgentAnalysis | null = null;
  loading = false;
  error   = '';
  open    = false;

  constructor(private cohortService: CohortService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Auto-load when a new requestId arrives
    if (changes['requestId']?.currentValue) {
      this.runAnalysis();
    }
  }

  runAnalysis(): void {
    if (!this.requestId) return;
    this.loading  = true;
    this.analysis = null;
    this.error    = '';
    this.open     = true;
    this.cohortService.getAgentAnalysis(this.requestId).subscribe({
      next: (r: AgentAnalysis) => { this.analysis = r; this.loading = false; },
      error: ()                 => { this.error = 'Could not run analysis. Ensure backend is running.'; this.loading = false; }
    });
  }

  toggle(): void { this.open = !this.open; if (this.open && !this.analysis) this.runAnalysis(); }
  close():  void { this.open = false; }

  get recColor(): string {
    if (!this.analysis) return '#5C728C';
    return {
      APPROVE:     '#1A8240',
      FLAG:        '#BE780E',
      REJECT_RISK: '#C22626'
    }[this.analysis.recommendation] ?? '#5C728C';
  }

  get recIcon(): string {
    if (!this.analysis) return 'psychology';
    return { APPROVE: 'check_circle', FLAG: 'warning', REJECT_RISK: 'cancel' }[this.analysis.recommendation] ?? 'psychology';
  }

  get urgencyColor(): string {
    if (!this.analysis) return '#5C728C';
    return { HIGH: '#C22626', MEDIUM: '#BE780E', LOW: '#1A8240' }[this.analysis.urgency] ?? '#5C728C';
  }

  get scoreColor(): string {
    if (!this.analysis) return '#5C728C';
    const s = this.analysis.confidenceScore;
    return s >= 75 ? '#1A8240' : s >= 45 ? '#BE780E' : '#C22626';
  }
}
