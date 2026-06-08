// src/app/core/services/cohort.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CohortRequest, CreateCohortRequest, ApprovalDecision, DashboardStats } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CohortService {
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Admin
  getAllRequests(): Observable<CohortRequest[]> {
    return this.http.get<CohortRequest[]>(`${this.API}/admin/requests`);
  }

  getPendingRequests(): Observable<CohortRequest[]> {
    return this.http.get<CohortRequest[]>(`${this.API}/admin/requests/pending`);
  }

  getRequestById(id: number): Observable<CohortRequest> {
    return this.http.get<CohortRequest>(`${this.API}/admin/requests/${id}`);
  }

  processDecision(id: number, decision: ApprovalDecision): Observable<CohortRequest> {
    return this.http.post<CohortRequest>(`${this.API}/admin/requests/${id}/decision`, decision);
  }

  rePing(cohortId: number, smeId: number): Observable<void> {
    return this.http.post<void>(`${this.API}/admin/requests/${cohortId}/smes/${smeId}/reping`, {});
  }

  getAdminDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API}/admin/dashboard`);
  }

  // POC
  getMyRequests(): Observable<CohortRequest[]> {
    return this.http.get<CohortRequest[]>(`${this.API}/poc/requests`);
  }

  createRequest(req: CreateCohortRequest): Observable<CohortRequest> {
    return this.http.post<CohortRequest>(`${this.API}/poc/requests`, req);
  }

  getMyRequestById(id: number): Observable<CohortRequest> {
    return this.http.get<CohortRequest>(`${this.API}/poc/requests/${id}`);
  }

  getPocDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API}/poc/dashboard`);
  }

  // SME Response (public)
  getResponseByToken(token: string): Observable<any> {
    return this.http.get(`${this.API}/sme-responses/token/${token}`);
  }

  submitResponse(req: { token: string; decision: string; preferredDate?: string; declineReason?: string }): Observable<any> {
    return this.http.post(`${this.API}/sme-responses/respond`, req);
  }

  // ── AI Decision Assistant ──────────────────────────────────────────────────
  getAgentAnalysis(requestId: number): Observable<any> {
    return this.http.get(`${this.API}/admin/agent/analyse/${requestId}`);
  }
}
