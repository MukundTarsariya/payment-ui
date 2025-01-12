import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Payment } from '../models/payment.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-view',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './payment-view.component.html',
  styleUrls: ['./payment-view.component.css']
})
export class PaymentViewComponent implements OnInit {
  payment: Payment | null = null;
  private apiUrl = 'https://payment-2meh.onrender.com/payments';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<Payment>(`${this.apiUrl}/${id}`).subscribe(data => {
        this.payment = data;
      });
    }
  }
}
