import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';  
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';  // Import here
import { Payment } from '../models/payment.model';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {
  payments: Payment[] = [];
  searchTerm = '';
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'totalDue', 'status', 'actions'];
  currentPage = 0;
  pageSize = 10;

  private apiUrl = 'https://payment-2meh.onrender.com/payments';

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchPayments();
  }
  navigateToAddPayment(): void {
    this.router.navigate(['/add']);
  }
  fetchPayments(): void {
    const params = {
      skip: this.currentPage * this.pageSize,
      limit: this.pageSize
    };

    this.http.get<Payment[]>(this.apiUrl, { params }).subscribe(data => {
      this.payments = data;
    });
  }

  searchPayments(): void {
    if (this.searchTerm) {
      this.http.get<Payment[]>(`${this.apiUrl}?search=${this.searchTerm}`).subscribe(data => {
        this.payments = data;
      });
    } else {
      this.fetchPayments();
    }
  }

  viewPayment(payment: Payment): void {
    this.router.navigate(['/view', payment._id]);
  }

  editPayment(payment: Payment): void {
    this.router.navigate(['/edit', payment._id]);
  }

  deletePayment(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
          this.fetchPayments();
        });
      }
    });
  }

  downloadEvidence(id: string): void {
    window.open(`${this.apiUrl}/${id}/download_evidence`, '_blank');
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchPayments();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchPayments();
    }
  }
  onFileSelected(event: any, paymentId: string): void {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadEvidence(paymentId, file);
    }
  }

  uploadEvidence(paymentId: string, file: File): void {
    const formData = new FormData();
    formData.append('file', file);

    this.http.post(`${this.apiUrl}/${paymentId}/upload_evidence`, formData).subscribe(() => {
      // this.fetchPayments();  // Refresh the list after upload
      this.router.navigate(['/']);
    });
  }

  
}
