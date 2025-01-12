import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Payment } from '../models/payment.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
    MatNativeDateModule,
    MatAutocompleteModule
  ],
  templateUrl: './payment-edit.component.html',
  styleUrls: ['./payment-edit.component.css']
})
export class PaymentEditComponent implements OnInit {
  paymentForm: FormGroup;
  payment: Payment | null = null;
  evidenceFile: File | null = null;
  countries: string[] = [];
  cities: { [key: string]: string[] } = {}; // Map of countries to their cities
  filteredCountries: Observable<string[]>;
  filteredCities: Observable<string[]>;
  currencies: string[] = ['USD', 'EUR', 'GBP'];
  filteredCurrencies: Observable<string[]>;
  private apiUrl = 'https://payment-2meh.onrender.com/payments';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      due_amount: ['', Validators.required],
      payee_due_date: ['', Validators.required],
      payee_payment_status: ['', Validators.required],
      payee_address_line_1: ['', Validators.required],
      payee_city: ['', Validators.required],
      payee_country: ['', Validators.required],
      currency: ['', Validators.required]
    });

    this.filteredCountries = this.paymentForm.get('payee_country')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.countries))
    );

    this.filteredCities = this.paymentForm.get('payee_city')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.getCitiesForCountry(this.paymentForm.value.payee_country)))
    );

    this.filteredCurrencies = this.paymentForm.get('currency')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.currencies))
    );

    this.loadCountries();
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  loadCountries(): void {
    this.http.get<any>('https://countriesnow.space/api/v0.1/countries').subscribe(data => {
      this.countries = data.data.map((country: any) => country.country);
      data.data.forEach((country: any) => {
        this.cities[country.country] = country.cities;
      });
    });
  }

  private getCitiesForCountry(country: string): string[] {
    return this.cities[country] || [];
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<Payment>(`${this.apiUrl}/${id}`).subscribe(data => {
        this.payment = data;
        this.paymentForm.patchValue({
          due_amount: data.due_amount,
          payee_due_date: new Date(data.payee_due_date),
          payee_payment_status: data.payee_payment_status,
          payee_address_line_1: data.payee_address_line_1,
          payee_city: data.payee_city,
          payee_country: data.payee_country,
          currency: data.currency
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
