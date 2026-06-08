// src/app/features/poc/cohorts/cohort-list/cohort-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CohortService } from '../../../../core/services/cohort.service';
import { CohortRequest } from '../../../../shared/models';

@Component({
  selector: 'app-cohort-list',
  template: `
  <div style="max-width:1400px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
      <div><h2 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#0E1630">My Cohorts</h2>
           <p style="margin:0;color:#5C728C;font-size:14px">All your submitted cohort requests and their statuses</p></div>
      <button mat-raised-button color="primary" routerLink="/poc/cohorts/new"><mat-icon>add</mat-icon> New Request</button>
    </div>
    <app-loading-spinner *ngIf="loading"></app-loading-spinner>
    <div *ngIf="!loading">
      <div *ngIf="!cohorts.length" style="text-align:center;padding:60px">
        <mat-icon style="font-size:64px;width:64px;height:64px;color:#C8D4E4">folder_open</mat-icon>
        <p style="color:#9BA8BB;font-size:16px">No cohort requests yet.</p>
        <button mat-raised-button color="primary" routerLink="/poc/cohorts/new">Create your first request</button>
      </div>
      <mat-card *ngIf="cohorts.length" style="overflow:hidden">
        <table mat-table [dataSource]="cohorts" style="width:100%">
          <ng-container matColumnDef="cohortId">
            <th mat-header-cell *matHeaderCellDef>Cohort ID</th>
            <td mat-cell *matCellDef="let c"><strong style="color:#2A70B2">{{ c.cohortId }}</strong></td>
          </ng-container>
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Evaluation Type</th>
            <td mat-cell *matCellDef="let c">{{ c.evaluationType }}</td>
          </ng-container>
          <ng-container matColumnDef="specialties">
            <th mat-header-cell *matHeaderCellDef>Specialties</th>
            <td mat-cell *matCellDef="let c"><app-specialty-chips [specialties]="c.requiredSpecialties" [maxShow]="2"></app-specialty-chips></td>
          </ng-container>
          <ng-container matColumnDef="smes">
            <th mat-header-cell *matHeaderCellDef>SMEs</th>
            <td mat-cell *matCellDef="let c"><strong>{{ c.confirmedCount }}/{{ c.smesRequired }}</strong></td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let c"><app-status-badge [status]="c.status"></app-status-badge></td>
          </ng-container>
          <ng-container matColumnDef="dates">
            <th mat-header-cell *matHeaderCellDef>Dates</th>
            <td mat-cell *matCellDef="let c" style="font-size:12px;color:#5C728C">{{ c.preferredDateFrom | date:'mediumDate' }}</td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let c">
              <button mat-icon-button color="primary" matTooltip="Track responses" (click)="track(c.id)"><mat-icon>track_changes</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols" style="cursor:pointer" (click)="track(row.id)"></tr>
        </table>
      </mat-card>
    </div>
  </div>`
})
export class CohortListComponent implements OnInit {
  cohorts: CohortRequest[] = [];
  loading = false;
  cols = ['cohortId','type','specialties','smes','status','dates','actions'];

  constructor(private cohortService: CohortService, private router: Router) {}
  ngOnInit(): void { this.loading = true; this.cohortService.getMyRequests().subscribe(d => { this.cohorts = d; this.loading = false; }); }
  track(id: number): void { this.router.navigate(['/poc/tracker', id]); }
}
