import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  loading = true;

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('assets/data/dashboard.json').subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: () => {
        this.stats = null;
        this.loading = false;
      },
    });
  }
}
