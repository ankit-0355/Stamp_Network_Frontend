import { Component, inject, signal } from '@angular/core';
import { Helper } from '../../Services/helper';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { form, FormField, required } from '@angular/forms/signals';
import { storeData } from '../../models/model';
import { AuthService } from '../../Services/auth-service'

@Component({
  selector: 'app-store-signup',
  imports: [MatIcon, RouterLink, FormField],
  templateUrl: './store-signup.html',
  styleUrl: './store-signup.css',
})
export class StoreSignup {
  helperService = inject(Helper);
  authService = inject(AuthService)

  storeModel = signal<storeData>({
    storeName: '',
    email: '',
    password: ''
  })

  isSuccess = signal(false);
  isLoading = signal(false);

  storeForm = form(this.storeModel, (schemaPath) => {
    required(schemaPath.storeName, { message: 'Store Name is required' });
    required(schemaPath.email, { message: 'Email is required' });
    required(schemaPath.password, { message: 'Password is required' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    // Perform signup logic here
    const res = this.storeModel();
    console.log('Form Data', res);
    
    this.isLoading.set(true);
    this.authService.storeSignup(res).subscribe({
      next: (res) => {
        console.log(res)
        this.isLoading.set(false);
        this.isSuccess.set(true);
      },
      error: (err) => {
        console.log(err)
        this.isLoading.set(false);
      }
    })
  }

}
