import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfileData } from '../models/profile-data.model';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private http = inject(HttpClient);
    public profileData = signal<ProfileData | null>(null);

    /**
     * Called once on app initialization
     */
    public loadProfile(): void {
        this.http.get<ProfileData>('/assets/profile-data.json').subscribe({
            next: (data) => {
                this.profileData.set(data);
            },
            error: (error) => {
                console.error('Failed to load profile data:', error);
            }
        });
    }

    public getProfile() {
        return this.profileData;
    }
}
