export interface Payment {
  _id: string;
  payee_first_name: string;
  payee_last_name: string;
  payee_payment_status: 'completed' | 'due_now' | 'overdue' | 'pending';
  payee_added_date_utc: string;  // Use string for ISO date format
  payee_due_date: string;  // Use string for YYYY-MM-DD format
  payee_address_line_1: string;
  payee_address_line_2?: string;
  payee_city: string;
  payee_country: string;  // ISO 3166-1 alpha-2
  payee_province_or_state?: string;
  payee_postal_code: string;
  payee_phone_number: string;  // E.164 format
  payee_email: string;
  currency: string;  // ISO 4217
  discount_percent?: number;  // Optional, 2 decimal points
  tax_percent?: number;  // Optional, 2 decimal points
  due_amount: number;  // 2 decimal points
  total_due: number;  // Calculated, 2 decimal points
  evidence_file?: string;
}