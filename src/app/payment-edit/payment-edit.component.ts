import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Payment } from '../models/payment.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './payment-edit.component.html',
  styleUrls: ['./payment-edit.component.css']
})
export class PaymentEditComponent implements OnInit {
  paymentForm: FormGroup;
  payment: Payment | null = null;
  evidenceFile: File | null = null;
  private apiUrl = 'https://payment-2meh.onrender.com/payments';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      due_amount: [''],
      payee_due_date: [''],
      payee_payment_status: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<Payment>(`${this.apiUrl}/${id}`).subscribe(data => {
        this.payment = data;
        this.paymentForm.patchValue({
          due_amount: data.due_amount,
          payee_due_date: new Date(data.payee_due_date),
          payee_payment_status: data.payee_payment_status
        });
      });
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  
    if (file && allowedTypes.includes(file.type)) {
      this.evidenceFile = file;
    } else {
      alert('Invalid file type. Please upload a PDF, PNG, or JPG file.');  
      this.evidenceFile = null;
    }
  }

  saveChanges(): void {
    if (this.payment) {
      const status = this.paymentForm.value.payee_payment_status;
      if (status === 'completed' && !this.evidenceFile) {
        alert('Please upload evidence before marking as completed.');
        return;
      }

      const updatedData = {
        ...this.paymentForm.value,
        payee_due_date: new Date(this.paymentForm.value.payee_due_date).toISOString()
      };

      this.http.put(`${this.apiUrl}/${this.payment._id}`, updatedData).subscribe(() => {
        if (status === 'completed' && this.evidenceFile) {
          this.uploadEvidence(this.payment!._id!);
        } else {
          this.router.navigate(['/']);
        }
      });
    }
  }

  uploadEvidence(paymentId: string): void {
    if (!this.evidenceFile) return;

    const formData = new FormData();
    formData.append('file', this.evidenceFile);

    this.http.post(`${this.apiUrl}/${paymentId}/upload_evidence`, formData).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
