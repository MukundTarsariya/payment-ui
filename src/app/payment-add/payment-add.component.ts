import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
  selector: 'app-payment-add',
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
  templateUrl: './payment-add.component.html',
  styleUrls: ['./payment-add.component.css']
})
export class PaymentAddComponent {
  paymentForm: FormGroup;
  countries: string[] = [];
  filteredCountries: Observable<string[]>;
  cities: string[] = [];
  filteredCities: Observable<string[]>;
  currencies: string[] = ['USD', 'EUR', 'GBP'];
  filteredCurrencies: Observable<string[]>;

  private apiUrl = 'http://127.0.0.1:8000/payments';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      payee_first_name: ['', Validators.required],
      payee_last_name: ['', Validators.required],
      payee_payment_status: [{ value: 'pending', disabled: true }],
      payee_added_date_utc: [new Date().toISOString()],
      payee_due_date: ['', Validators.required],
      payee_address_line_1: ['', Validators.required],
      payee_address_line_2: [''],
      payee_city: ['', Validators.required],
      payee_country: ['', Validators.required],
      payee_province_or_state: [''],
      payee_postal_code: ['', Validators.required],
      payee_phone_number: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      payee_email: ['', [Validators.required, Validators.email]],
      currency: ['', Validators.required],
      discount_percent: [''],
      tax_percent: [''],
      due_amount: ['', Validators.required]
    });

    this.filteredCountries = this.paymentForm.get('payee_country')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.countries))
    );

    this.filteredCities = this.paymentForm.get('payee_city')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, this.cities))
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
    });
  }

  loadCities(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  const country = inputElement.value;
  this.http.post<any>('https://countriesnow.space/api/v0.1/countries/cities', { country }).subscribe(data => {
    this.cities = data.data;
  });
}

  addPayment(): void {
    const newPayment = {
      ...this.paymentForm.value,
      payee_due_date: new Date(this.paymentForm.value.payee_due_date).toISOString()
    };

    this.http.post(this.apiUrl, newPayment).subscribe(() => {
      this.router.navigate(['/']);  // Navigate back to the listing page
    });
  }
}