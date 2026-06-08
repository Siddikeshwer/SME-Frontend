import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AuthResponse } from '../../shared/models';

interface NavLink {
  path:   string;
  icon:   string;
  label:  string;
  exact:  boolean;
  badge?: boolean;   // optional — only set on the AI Agent link
}

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  currentUser: AuthResponse | null = null;
  sidebarOpen = true;
  currentUrl  = '';

  adminLinks: NavLink[] = [
    { path: '/admin/dashboard', icon: 'dashboard',   label: 'Dashboard',         exact: true  },
    { path: '/admin/smes',      icon: 'people',       label: 'SME Database',      exact: true  },
    { path: '/admin/approvals', icon: 'check_circle', label: 'Approvals',         exact: false },
    { path: '/admin/agent',     icon: 'psychology',   label: 'AI Decision Agent', exact: true, badge: true },
  ];

  pocLinks: NavLink[] = [
    { path: '/poc/dashboard',   icon: 'dashboard',  label: 'Dashboard',    exact: true },
    { path: '/poc/cohorts',     icon: 'folder',     label: 'My Cohorts',   exact: true },
    { path: '/poc/cohorts/new', icon: 'add_circle', label: 'New Request',  exact: true },
  ];

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
    this.currentUrl  = this.router.url;

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => this.currentUrl = e.urlAfterRedirects);

    if (this.router.url === '/') {
      this.router.navigate([this.auth.isAdmin() ? '/admin/dashboard' : '/poc/dashboard']);
    }
  }

  get navLinks(): NavLink[] { return this.auth.isAdmin() ? this.adminLinks : this.pocLinks; }

  isActive(link: NavLink): boolean {
    if (link.exact) return this.currentUrl === link.path;
    return this.currentUrl.startsWith(link.path);
  }

  logout(): void        { this.auth.logout(); }
  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }
}
