import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PaymentAddComponent } from './payment-add/payment-add.component';
import { PaymentEditComponent } from './payment-edit/payment-edit.component';
import { PaymentViewComponent } from './payment-view/payment-view.component';  // Import here


const routes: Routes = [
  { path: '', component: PaymentListComponent },
  { path: 'add', component: PaymentAddComponent },
  { path: 'edit/:id', component: PaymentEditComponent },
  { path: 'view/:id', component: PaymentViewComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}