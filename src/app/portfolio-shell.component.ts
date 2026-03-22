import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from './core/services/profile.service';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { HeroComponent } from './features/hero/hero.component';
import { WhyChooseMeComponent } from './features/why-choose-me/why-choose-me.component';
import { AboutComponent } from './features/about/about.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { SkillsComponent } from './features/skills/skills.component';
import { ExperienceComponent } from './features/experience/experience.component';
import { ContactComponent } from './features/contact/contact.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-portfolio-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    WhyChooseMeComponent,
    AboutComponent,
    ProjectsComponent,
    SkillsComponent,
    ExperienceComponent,
    ContactComponent,
    FooterComponent
  ],
  template: `
    @if(profileData()) {
      <app-navbar></app-navbar>
      <main>
        <app-hero></app-hero>
        <app-why-choose-me></app-why-choose-me>
        <app-about></app-about>
        <app-projects></app-projects>
        <app-skills></app-skills>
        <app-experience></app-experience>
        <app-contact></app-contact>
      </main>
      <app-footer></app-footer>
    }
  `
})
export class PortfolioShellComponent implements OnInit {
  private profileService = inject(ProfileService);
  private seo = inject(SeoService);
  profileData = this.profileService.profileData;

  ngOnInit(): void {
    this.profileService.loadProfile();

    this.seo.updateSeo({
      title: 'Sohanlal Borawar — IoT Developer & ThingsBoard Expert',
      description: 'IoT Developer specializing in ThingsBoard, real-time telemetry systems, MQTT, and scalable device management. Available for IoT projects worldwide.',
      keywords: 'IoT Developer, ThingsBoard, MQTT, Angular, Real-time Telemetry, Device Management, Node.js, Docker, Grafana, IoT Solutions, Remote IoT Developer',
      author: 'Sohanlal Borawar',
      image: 'https://sohanlal-borawar.vercel.app/assets/profile-image.jpg',
      url: 'https://sohanlal-borawar.vercel.app'
    });
  }
}
