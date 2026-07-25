import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs';
import { confirmRewardResponse, memberData, transactionsModel, validateStampResponse } from '../models/model';
import { CookieService } from 'ngx-cookie-service';
import { env_variable } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class Helper {
  http = inject(HttpClient)
  cookieService = inject(CookieService);

  amt = env_variable.REWARD;
  baseurl = env_variable.SERVER_URL

  showPassword = signal<boolean>(false);

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  getDashboardDate() {
    return this.http.get<any>(this.baseurl + '/api/dashboard?storeId=' + this.cookieService.get('store_id')).pipe(
      map((res) => {
        res.transactions = res.transactions.map((item: transactionsModel) => ({
          ...item,
          timestamp: this.formatDateTime(item.timestamp),
          activity: this.getIconActivity(item.activity)[1],
          icon: this.getIconActivity(item.activity)[0],
        }));
        return res;
      }),
    )
  }

  private formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);

    const optionsDate: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    const optionsTime: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    const formattedDate = date.toLocaleDateString('en-US', optionsDate);
    const formattedTime = date.toLocaleTimeString('en-US', optionsTime);

    return `${formattedDate} ${formattedTime}`;
  }

  getIconActivity(activity: string) {
    switch (activity) {
      case 'Stamp':
        return ['task_alt', 'Earned 1 Stamp'];
      case 'Reward':
        return ['redeem', `Claimed ${this.amt} Discount`];
      case 'Enrollment':
        return ['person_add', 'New Customer Enrolled'];
      default:
        return ['Undefined', 'Undefined'];
    }
  }

  validateStamp(phoneNumber: string, storeId: string) {
    const params = { phone_number: phoneNumber, store_id: storeId };
    return this.http.post<validateStampResponse>(
      this.baseurl + '/api/validate',
      null,
      { params }
    );
  }

  confirmReward(phoneNumber: string, storeId: string) {
    const params = { phone_number: phoneNumber, store_id: storeId };
    return this.http.post<confirmRewardResponse>(
      this.baseurl + '/api/confirm-reward',
      null,
      { params }
    );
  }

  enrollMember(data: any) {
    console.log(data)
    return this.http.post<any>(this.baseurl + '/api/enrolluser', data)
  }
}
