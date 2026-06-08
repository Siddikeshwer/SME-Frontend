// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { UnauthorizedComponent } from './features/auth/unauthorized/unauthorized.component';
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { SmeDatabaseComponent } from './features/admin/sme-database/sme-database.component';
import { ApprovalListComponent } from './features/admin/approval/approval-list/approval-list.component';
import { ApprovalDetailComponent } from './features/admin/approval/approval-detail/approval-detail.component';
import { AgentDashboardComponent } from './features/admin/agent/agent-dashboard.component';
import { PocDashboardComponent } from './features/poc/dashboard/poc-dashboard.component';
import { CohortListComponent } from './features/poc/cohorts/cohort-list/cohort-list.component';
import { CreateCohortComponent } from './features/poc/cohorts/create-cohort/create-cohort.component';
import { RequestTrackerComponent } from './features/poc/tracker/request-tracker.component';
import { SmeResponsePortalComponent } from './features/sme/response-portal/sme-response-portal.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'respond/:token', component: SmeResponsePortalComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },

  {
    path: '', component: MainLayoutComponent, canActivate: [AuthGuard],
    children: [
      // Admin
      { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
      { path: 'admin/smes', component: SmeDatabaseComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
      { path: 'admin/approvals', component: ApprovalListComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
      { path: 'admin/agent', component: AgentDashboardComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
      { path: 'admin/approvals/:id', component: ApprovalDetailComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },

      // POC
      { path: 'poc/dashboard', component: PocDashboardComponent, canActivate: [AuthGuard], data: { roles: ['POC', 'ADMIN'] } },
      { path: 'poc/cohorts', component: CohortListComponent, canActivate: [AuthGuard], data: { roles: ['POC', 'ADMIN'] } },
      { path: 'poc/cohorts/new', component: CreateCohortComponent, canActivate: [AuthGuard], data: { roles: ['POC', 'ADMIN'] } },
      { path: 'poc/tracker/:id', component: RequestTrackerComponent, canActivate: [AuthGuard], data: { roles: ['POC', 'ADMIN'] } },

      // Default redirects
      { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
