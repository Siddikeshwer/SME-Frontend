import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sme, SmeRequest, SmeSummary, AvailabilityStatus } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SmeService {
  private readonly ADMIN_API = `${environment.apiUrl}/admin/smes`;
  private readonly POC_API   = `${environment.apiUrl}/poc/smes`;

  constructor(private http: HttpClient) {}

  // ── Admin SME management ──────────────────────────────────────────────────
  getAll(name?: string, dept?: string, status?: AvailabilityStatus, specialty?: string): Observable<Sme[]> {
    let params = new HttpParams();
    if (name)      params = params.set('name', name);
    if (dept)      params = params.set('dept', dept);
    if (status)    params = params.set('status', status);
    if (specialty) params = params.set('specialty', specialty);
    return this.http.get<Sme[]>(this.ADMIN_API, { params });
  }

  getById(id: number): Observable<Sme> {
    return this.http.get<Sme>(`${this.ADMIN_API}/${id}`);
  }

  create(req: SmeRequest): Observable<Sme> {
    return this.http.post<Sme>(this.ADMIN_API, req);
  }

  update(id: number, req: SmeRequest): Observable<Sme> {
    return this.http.put<Sme>(`${this.ADMIN_API}/${id}`, req);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.ADMIN_API}/${id}`);
  }

  updateAvailability(id: number, status: AvailabilityStatus): Observable<void> {
    return this.http.patch<void>(`${this.ADMIN_API}/${id}/availability`, { status });
  }

  // FIX 5: Admin specialty filter dropdown
  getAllSpecialties(): Observable<string[]> {
    return this.http.get<string[]>(`${this.ADMIN_API}/specialties`);
  }

  // ── POC SME lookup (FIX BUG 1) ──────────────────────────────────────────
  // POC calls /poc/smes/available — NOT /admin/smes/available
  // SecurityConfig only allows POC on /poc/** routes
  findAvailableBySpecialties(specialties: string[]): Observable<SmeSummary[]> {
    // Send specialties as repeated query params: specialties=Angular&specialties=.NET
    let params = new HttpParams();
    specialties.forEach(spec => {
      params = params.append('specialties', spec);
    });
    return this.http.get<SmeSummary[]>(`${this.POC_API}/available`, { params });
  }
}
