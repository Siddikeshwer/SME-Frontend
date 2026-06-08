// src/app/shared/components/status-badge/status-badge.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `
    <span class="badge" [style.background]="getBg()" [style.color]="getColor()" [class.large]="large">
      {{ getLabel() }}
    </span>`,
  styles: [`
    .badge { display:inline-block; padding:2px 10px; border-radius:10px; font-size:11px;
             font-weight:600; letter-spacing:.3px; white-space:nowrap; }
    .large { font-size:13px; padding:4px 14px; border-radius:12px; }
  `]
})
export class StatusBadgeComponent {
  @Input() status = '';
  @Input() type: 'request' | 'availability' | 'response' = 'request';
  @Input() large = false;

  private requestMap: Record<string, { bg: string; color: string; label: string }> = {
    SUBMITTED:         { bg: '#FFF3E0', color: '#BE780E', label: 'Submitted' },
    UNDER_REVIEW:      { bg: '#E3F2FD', color: '#1565C0', label: 'Under Review' },
    APPROVED:          { bg: '#E8F5E9', color: '#1A8240', label: 'Approved' },
    REJECTED:          { bg: '#FFEBEE', color: '#C22626', label: 'Rejected' },
    CHANGES_REQUESTED: { bg: '#F3E5F5', color: '#6838A8', label: 'Changes Requested' },
    CONFIRMED:         { bg: '#E8F5E9', color: '#1A8240', label: 'Confirmed' },
  };
  private availMap: Record<string, { bg: string; color: string; label: string }> = {
    AVAILABLE: { bg: '#E8F5E9', color: '#1A8240', label: 'Available' },
    BOOKED:    { bg: '#FFEBEE', color: '#C22626', label: 'Booked' },
    PENDING:   { bg: '#FFF3E0', color: '#BE780E', label: 'Pending' },
    ON_HOLD:   { bg: '#F3E5F5', color: '#6838A8', label: 'On Hold' },
    INACTIVE:  { bg: '#F5F5F5', color: '#757575', label: 'Inactive' },
  };
  private responseMap: Record<string, { bg: string; color: string; label: string }> = {
    ACCEPTED:    { bg: '#E8F5E9', color: '#1A8240', label: 'Accepted' },
    DECLINED:    { bg: '#FFEBEE', color: '#C22626', label: 'Declined' },
    PENDING:     { bg: '#FFF3E0', color: '#BE780E', label: 'Awaiting' },
    NO_RESPONSE: { bg: '#F5F5F5', color: '#757575', label: 'No Response' },
  };

  private get map() {
    return this.type === 'availability' ? this.availMap : this.type === 'response' ? this.responseMap : this.requestMap;
  }

  getBg():    string { return this.map[this.status]?.bg    ?? '#F5F5F5'; }
  getColor(): string { return this.map[this.status]?.color ?? '#757575'; }
  getLabel(): string { return this.map[this.status]?.label ?? this.status; }
}
