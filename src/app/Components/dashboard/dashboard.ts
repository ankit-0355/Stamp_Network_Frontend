import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { Helper } from '../../Services/helper';
import { dashboardModel } from '../../models/model';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AuthService } from '../../Services/auth-service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { delay } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatIcon, ScrollingModule, NgxSkeletonLoaderModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  helperService = inject(Helper)
  authService = inject(AuthService)
  dashboardData = signal<dashboardModel | null>(null);

  ngOnInit() {
    this.helperService.getDashboardDate().pipe(delay(2000))
      .subscribe({
        next: (res: any) => {
          this.dashboardData.set(res);
          console.log(this.dashboardData())
        },
        error: (err) => {
          console.error(err);
        }
      })
  }

  getStyle(icon: string) {
    switch (icon) {
      case 'task_alt': return 'bg-[#00D49230] text-[#00D492]';
      case 'redeem': return 'bg-[#CE8D0030] text-[#CE8D00]';
      case 'person_add': return 'bg-[#51A2FF30] text-[#51A2FF]';
      default: return 'bg-white'; // Fallback color if icon doesn't match
    }
  }


}


