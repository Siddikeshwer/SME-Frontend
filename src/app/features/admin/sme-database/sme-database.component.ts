import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sme, AvailabilityStatus } from '../../../shared/models';
import { SmeService } from '../../../core/services/sme.service';
import { SmeFormDialogComponent } from './sme-form-dialog/sme-form-dialog.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-sme-database',
  templateUrl: './sme-database.component.html',
  styleUrls: ['./sme-database.component.scss']
})
export class SmeDatabaseComponent implements OnInit {
  displayedColumns = ['avatar','fullName','email','specialties','department','yearsOfExperience','availabilityStatus','lastBooked','actions'];
  dataSource = new MatTableDataSource<Sme>([]);
  loading = false;

  // Filters
  searchTerm    = '';
  selectedStatus: AvailabilityStatus | '' = '';
  selectedSpecialty = '';       // FIX 5: new specialty filter

  // Dropdown options
  statusOptions: { value: AvailabilityStatus | ''; label: string }[] = [
    { value: '',          label: 'All Statuses' },
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'BOOKED',    label: 'Booked' },
    { value: 'PENDING',   label: 'Pending' },
    { value: 'ON_HOLD',   label: 'On Hold' },
    { value: 'INACTIVE',  label: 'Inactive' },
  ];
  specialtyOptions: string[] = [];   // FIX 5: loaded from backend

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)      sort!: MatSort;

  constructor(
    private smeService: SmeService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSmes();
    // FIX 5: Load all available specialties for the filter dropdown
    this.smeService.getAllSpecialties().subscribe({
      next: s => this.specialtyOptions = s,
      error: () => {}
    });
  }

  loadSmes(): void {
    this.loading = true;
    this.smeService.getAll(
      this.searchTerm  || undefined,
      undefined,
      this.selectedStatus   ? this.selectedStatus   as AvailabilityStatus : undefined,
      this.selectedSpecialty || undefined   // FIX 5: pass specialty
    ).subscribe({
      next: data => {
        this.dataSource.data = data;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort      = this.sort;
        });
        this.loading = false;
      },
      error: () => { this.loading = false; this.snack.open('Failed to load SMEs', 'Close', { duration: 3000 }); }
    });
  }

  applyFilter(): void { this.loadSmes(); }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedSpecialty = '';
    this.loadSmes();
  }

  openAddDialog(): void {
    this.dialog.open(SmeFormDialogComponent, { width: '680px', data: null })
      .afterClosed().subscribe(r => { if (r) this.loadSmes(); });
  }

  openEditDialog(sme: Sme): void {
    this.dialog.open(SmeFormDialogComponent, { width: '680px', data: sme })
      .afterClosed().subscribe(r => { if (r) this.loadSmes(); });
  }

  deleteSme(sme: Sme): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Remove SME', message: `Remove "${sme.fullName}" from the database?`, confirmText: 'Remove', danger: true }
    }).afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.smeService.delete(sme.id).subscribe({
          next: () => { this.snack.open('SME removed', 'Close', { duration: 3000 }); this.loadSmes(); },
          error: () => this.snack.open('Failed to remove SME', 'Close', { duration: 3000 })
        });
      }
    });
  }

  getInitials(name: string): string { return name ? name[0].toUpperCase() : '?'; }
  getAvailColor(s: AvailabilityStatus): string {
    const m: Record<string, string> = {
      AVAILABLE: '#1A8240', BOOKED: '#C22626', PENDING: '#BE780E', ON_HOLD: '#6838A8', INACTIVE: '#5C728C'
    };
    return m[s] ?? '#5C728C';
  }
}
