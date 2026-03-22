import { Component, inject, ChangeDetectionStrategy, computed, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AboutComponent {
  private profileService = inject(ProfileService);
  // Cast to any to bypass strict template checking for non-existent root fields like 'bio'
  profileData = computed(() => this.profileService.profileData() as any);

  techTags = [
    'ThingsBoard', 'MQTT', 'Node.js', 'Python',
    'Docker', 'PostgreSQL', 'Redis', 'Kafka',
    'Angular', 'Grafana', 'AWS', 'REST APIs'
  ];

  // Returns image URL with multiple fallbacks stripped
  getProfileImage(): string {
    const data = this.profileData();
    if (!data) return 'assets/profile-image.jpg';
    
    // Using the exact field defined in ProfileData model
    return data.profile?.avatarUrl || 'assets/profile-image.jpg';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    console.warn('Image failed to load:', img.src);
    // Try direct asset path as last resort
    if (!img.src.includes('profile-image.jpg')) {
      img.src = 'assets/profile-image.jpg';
    }
  }

  getInitials(name: string): string {
    if (!name) return 'ID';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
