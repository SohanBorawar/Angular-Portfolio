import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

const API = environment.adminApiUrl;

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);

  profileData = signal<any>(null);
  isSaving = signal(false);
  saveStatus = signal<'idle' | 'success' | 'error'>('idle');
  lastSaved = signal<Date | null>(null);

  loadProfile() {
    return this.http.get(`${API}/profile`).pipe(
      tap((data: any) => this.profileData.set(data))
    );
  }

  saveProfile(data: any) {
    this.isSaving.set(true);
    this.saveStatus.set('idle');

    // Log what's being saved for debugging
    console.log('Saving profile data:', JSON.stringify(data, null, 2));

    return this.http.post(`${API}/profile`, data, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      tap({
        next: (res: any) => {
          console.log('Save response:', res);
          this.isSaving.set(false);
          this.saveStatus.set('success');
          this.lastSaved.set(new Date());
          this.profileData.set(data);
          setTimeout(() => this.saveStatus.set('idle'), 3000);
        },
        error: (err) => {
          console.error('Save error:', err);
          this.isSaving.set(false);
          this.saveStatus.set('error');
        }
      })
    );
  }
}
