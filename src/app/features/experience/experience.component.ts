import {
  Component, inject, computed,
  ChangeDetectionStrategy, ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ExperienceComponent {
  private profileService = inject(ProfileService);
  profileData = this.profileService.profileData;

  experience = computed(() => {
    const data = this.profileData();
    if (!data) return [];
    // Use ONLY the field name that exists in ProfileData
    return data.experience || [];
  });

  education = computed(() => {
    const data = this.profileData();
    if (!data) return [];
    // Use ONLY the field name that exists in ProfileData
    return data.education || [];
  });

  getHighlights(job: any): string[] {
    if (!job) return [];
    if (Array.isArray(job.highlights))
      return job.highlights;
    if (typeof job.highlights === 'string')
      return job.highlights
        .split('\n')
        .map((h: string) => h.trim())
        .filter(Boolean);
    if (Array.isArray(job.bullets))
      return job.bullets;
    return [];
  }

  // Add safe accessor for education fields
  getEduField(edu: any, ...fields: string[]): string {
    for (const f of fields) {
      if (edu[f]) return edu[f];
    }
    return '';
  }
}
