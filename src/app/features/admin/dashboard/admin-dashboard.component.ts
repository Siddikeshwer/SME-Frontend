import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CohortService } from '../../../core/services/cohort.service';
import { DashboardStats, CohortRequest } from '../../../shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;

  // FIX 4: KPI cards defined in TS — no inline pipe expressions in template
  kpiCards: { label: string; valueKey: keyof DashboardStats; sub: string; color: string; icon: string; action?: string }[] = [
    { label: 'Total SMEs',        valueKey: 'totalSmes',        sub: 'in database',     color: 'blue',   icon: 'people',           action: 'smes' },
    { label: 'Available Now',     valueKey: 'availableSmes',    sub: 'ready to book',   color: 'green',  icon: 'check_circle',     action: 'smes' },
    { label: 'Pending Approvals', valueKey: 'pendingApprovals', sub: 'awaiting review', color: 'amber',  icon: 'pending_actions',  action: 'approvals' },
    { label: 'Booked This Month', valueKey: 'bookedSmes',       sub: 'confirmed slots', color: 'purple', icon: 'event_available',  action: '' },
  ];

  // Availability bar data
  availBars: { label: string; color: string; valueKey: keyof DashboardStats }[] = [
    { label: 'Available', color: '#1A8240', valueKey: 'availableSmes' },
    { label: 'Booked',    color: '#6838A8', valueKey: 'bookedSmes' },
    { label: 'Pending',   color: '#BE780E', valueKey: 'pendingSmes' },
  ];

  constructor(
    private cohortService: CohortService,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void { this.loadDashboard(); }

  loadDashboard(): void {
    this.loading = true;
    this.cohortService.getAdminDashboard().subscribe({
      next: data => { this.stats = data; this.loading = false; },
      error: () => { this.loading = false; this.snack.open('Failed to load dashboard', 'Close', { duration: 3000 }); }
    });
  }

  getKpiValue(key: keyof DashboardStats): number {
    if (!this.stats) return 0;
    const v = this.stats[key];
    return typeof v === 'number' ? v : 0;
  }

  getAvailPct(valueKey: keyof DashboardStats): number {
    if (!this.stats || !this.stats.totalSmes) return 0;
    return Math.round((this.getKpiValue(valueKey) / Number(this.stats.totalSmes)) * 100);
  }

  onKpiClick(action: string): void {
    if (action === 'smes')      this.router.navigate(['/admin/smes']);
    if (action === 'approvals') this.router.navigate(['/admin/approvals']);
  }

  viewRequest(id: number): void { this.router.navigate(['/admin/approvals', id]); }

  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      PING_SENT: 'send', REQUEST_APPROVED: 'check_circle', REQUEST_REJECTED: 'cancel',
      SME_ADDED: 'person_add', SME_REMOVED: 'person_remove',
      SME_ACCEPTED: 'thumb_up', SME_DECLINED: 'thumb_down',
      REQUEST_SUBMITTED: 'assignment', REPINGED: 'refresh'
    };
    return icons[type] ?? 'info';
  }

  getActivityColor(type: string): string {
    const colors: Record<string, string> = {
      PING_SENT: '#12987A', REQUEST_APPROVED: '#1A8240', REQUEST_REJECTED: '#C22626',
      SME_ADDED: '#2A70B2', SME_ACCEPTED: '#1A8240', SME_DECLINED: '#BE780E',
      REQUEST_SUBMITTED: '#6838A8', REPINGED: '#12987A'
    };
    return colors[type] ?? '#5C728C';
  }
}
