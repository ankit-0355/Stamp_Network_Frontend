import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { memberData } from '../../models/model';
import { form, FormField, required } from '@angular/forms/signals';
import { Helper } from '../../Services/helper';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-member-signup',
  imports: [RouterLink, MatIcon, FormField],
  templateUrl: './member-signup.html',
  styleUrl: './member-signup.css',
})
export class MemberSignup {
  private router = inject(Router);
  helperService = inject(Helper)
  cookieService = inject(CookieService)

  memberModel = signal<memberData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });

  isSuccess = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  memberForm = form(this.memberModel, (schemaPath) => {
    required(schemaPath.firstName, { message: 'First Name is required' });
    required(schemaPath.lastName, { message: 'Last Name is required' });
    required(schemaPath.phoneNumber, { message: 'Phone Number is required' });
    required(schemaPath.email, { message: 'Email is required' });
  });

  resetForm() {
    this.memberModel.set({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: ''
    })
    this.isSuccess.set(false);
  }

  onSubmit(event: Event) {
    event.preventDefault();
    // Perform login logic here

    const body: Record<string, string> = {
      'email': this.memberModel().email,
      'firstName': this.memberModel().firstName,
      'lastName': this.memberModel().lastName,
      'phoneNumber': this.memberModel().phoneNumber,
      'storeId': this.cookieService.get('store_id')
    }
    console.log('Form Data', body);

    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.helperService.enrollMember(body).subscribe({
      next: (res: any) => {
        console.log('Enrollment Response', res);
        console.log(res)
        this.isLoading.set(false);
        this.isSuccess.set(true);
      },
      error: (err: any) => {
        console.log('Enrollment Error', err);
        this.isLoading.set(false);
        if (err.error && err.error.detail) {
          this.errorMessage.set(err.error.detail);
        } else {
          this.errorMessage.set("An unexpected error occurred.");
        }
      }
    })
  }
}


