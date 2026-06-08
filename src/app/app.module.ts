// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// App
import { DatePipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';

// Layout
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { UnauthorizedComponent } from './features/auth/unauthorized/unauthorized.component';

// Admin
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { SmeDatabaseComponent } from './features/admin/sme-database/sme-database.component';
import { SmeFormDialogComponent } from './features/admin/sme-database/sme-form-dialog/sme-form-dialog.component';
import { ApprovalListComponent } from './features/admin/approval/approval-list/approval-list.component';
import { ApprovalDetailComponent } from './features/admin/approval/approval-detail/approval-detail.component';
import { AgentAssistComponent } from './features/admin/agent/agent-assist.component';
import { AgentDashboardComponent } from './features/admin/agent/agent-dashboard.component';

// POC
import { PocDashboardComponent } from './features/poc/dashboard/poc-dashboard.component';
import { CohortListComponent } from './features/poc/cohorts/cohort-list/cohort-list.component';
import { CreateCohortComponent } from './features/poc/cohorts/create-cohort/create-cohort.component';
import { RequestTrackerComponent } from './features/poc/tracker/request-tracker.component';

// SME
import { SmeResponsePortalComponent } from './features/sme/response-portal/sme-response-portal.component';

// Shared
import { StatusBadgeComponent } from './shared/components/status-badge/status-badge.component';
import { SpecialtyChipsComponent } from './shared/components/specialty-chips/specialty-chips.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';

const MATERIAL_MODULES = [
  MatToolbarModule, MatSidenavModule, MatListModule, MatIconModule,
  MatButtonModule, MatCardModule, MatTableModule, MatPaginatorModule,
  MatSortModule, MatInputModule, MatFormFieldModule, MatSelectModule,
  MatDialogModule, MatSnackBarModule, MatChipsModule, MatBadgeModule,
  MatProgressSpinnerModule, MatMenuModule, MatTooltipModule,
  MatDatepickerModule, MatNativeDateModule, MatStepperModule,
  MatTabsModule, MatExpansionModule, MatDividerModule, MatCheckboxModule,
  MatRadioModule, MatSlideToggleModule, MatProgressBarModule
];

@NgModule({
  declarations: [
    AppComponent, MainLayoutComponent, LoginComponent, UnauthorizedComponent,
    AdminDashboardComponent, SmeDatabaseComponent, SmeFormDialogComponent,
    ApprovalListComponent, ApprovalDetailComponent,
    AgentAssistComponent,
    AgentDashboardComponent,
    PocDashboardComponent, CohortListComponent, CreateCohortComponent,
    RequestTrackerComponent, SmeResponsePortalComponent,
    StatusBadgeComponent, SpecialtyChipsComponent,
    ConfirmDialogComponent, LoadingSpinnerComponent,
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, HttpClientModule,
    FormsModule, ReactiveFormsModule, AppRoutingModule,
    ...MATERIAL_MODULES
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
