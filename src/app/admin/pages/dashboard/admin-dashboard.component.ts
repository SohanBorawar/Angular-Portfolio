import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import { AdminService } from '../../services/admin.service';
import { ProfileSectionComponent } from '../../sections/profile-section/profile-section.component';
import { ExperienceSectionComponent } from '../../sections/experience-section/experience-section.component';
import { ProjectsSectionComponent } from '../../sections/projects-section/projects-section.component';
import { SkillsSectionComponent } from '../../sections/skills-section/skills-section.component';
import { ContactSectionComponent } from '../../sections/contact-section/contact-section.component';

type DashTab = 'profile' | 'experience' | 'projects' | 'skills' | 'contact' | 'raw';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ProfileSectionComponent,
    ExperienceSectionComponent,
    ProjectsSectionComponent,
    SkillsSectionComponent,
    ContactSectionComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  private auth = inject(AdminAuthService);
  private adminService = inject(AdminService);
  private router = inject(Router);

  activeTab = signal<DashTab>('profile');
  isLoading = signal(true);
  connectionError = signal(false);
  showLogoutConfirm = signal(false);

  profileData = this.adminService.profileData;
  isSaving = this.adminService.isSaving;
  saveStatus = this.adminService.saveStatus;
  lastSaved = this.adminService.lastSaved;

  navItems = [
    { id: 'profile',    label: 'Profile',    icon: '👤', desc: 'Personal info & social' },
    { id: 'experience', label: 'Experience', icon: '💼', desc: 'Career history' },
    { id: 'projects',   label: 'Projects',   icon: '🚀', desc: 'Portfolio projects' },
    { id: 'skills',     label: 'Skills',     icon: '🛠️', desc: 'Tech stack' },
    { id: 'contact',    label: 'Contact',    icon: '📞', desc: 'Contact details' },
    { id: 'raw',        label: 'Raw JSON',   icon: '{ }', desc: 'Direct JSON edit' },
  ] as const;

  ngOnInit(): void {
    this.adminService.loadProfile().subscribe({
      next: () => this.isLoading.set(false),
      error: () => {
        this.isLoading.set(false);
        this.connectionError.set(true);
      }
    });
  }

  setTab(tab: DashTab): void {
    this.activeTab.set(tab);
  }

  onSave(updatedData: any): void {
    this.adminService.saveProfile(updatedData).subscribe();
  }

  onSaveRaw(value: string): void {
    try {
      const parsed = JSON.parse(value);
      this.onSave(parsed);
    } catch {
      alert('Invalid JSON syntax. Please fix errors and try again.');
    }
  }

  openPortfolio(): void {
    window.open('http://localhost:4200', '_blank');
  }

  confirmLogout(): void {
    this.showLogoutConfirm.set(true);
  }

  cancelLogout(): void {
    this.showLogoutConfirm.set(false);
  }

  logout(): void {
    this.auth.logout();
  }
}
