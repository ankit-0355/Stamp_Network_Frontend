import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorService } from './Services/error.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIcon],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  errorService = inject(ErrorService);
}
