import { Component, ChangeDetectionStrategy, inject, signal, HostListener, OnInit, OnDestroy, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit, OnDestroy {
  private viewportScroller = inject(ViewportScroller);
  private router = inject(Router);
  public profileData = inject(ProfileService).getProfile();
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  public isScrolled = signal(false);
  public isMobileMenuOpen = signal(false);
  public activeSection = signal<string>('hero');
  public isDarkMode = signal(true);

  private observer: IntersectionObserver | null = null;

  public navLinks = [
    { label: 'About', frag: 'about' },
    { label: 'Projects', frag: 'projects' },
    { label: 'Skills', frag: 'skills' },
    { label: 'Experience', frag: 'experience' },
    { label: 'contact', frag: 'contact' }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollOffset > 100 !== this.isScrolled()) {
        this.isScrolled.set(scrollOffset > 100);
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isMobileMenuOpen() && isPlatformBrowser(this.platformId)) {
        const target = event.target as HTMLElement;
        const clickedInside = target.closest('.navbar') || target.closest('.mobile-menu-dropdown');
        if (!clickedInside) {
            this.closeMobileMenu();
        }
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      const isDark = saved ? saved === 'dark' : prefersDark ?? true;
      this.isDarkMode.set(isDark);
      this.applyTheme(isDark);      this.observer = new IntersectionObserver((entries) => {
        let maxVisibleRatio = 0;
        let activeElId = '';

        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > maxVisibleRatio) {
            maxVisibleRatio = entry.intersectionRatio;
            activeElId = entry.target.id;
          }
        });

        if (activeElId && this.activeSection() !== activeElId) {
          this.activeSection.set(activeElId);
          this.cdr.markForCheck();
        }
      }, {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5]
      });

      // Observe all sections
      setTimeout(() => {
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => this.observer?.observe(section));
      }, 500); // Give DOM time to render
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  public toggleTheme(): void {
    const newVal = !this.isDarkMode();
    this.isDarkMode.set(newVal);
    this.applyTheme(newVal);
    if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('theme', newVal ? 'dark' : 'light');
    }
  }

  private applyTheme(isDark: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
        const body = document.body;
        body.classList.remove('dark-theme', 'light-theme');
        body.classList.add(isDark ? 'dark-theme' : 'light-theme');
    }
  }

  public scrollTo(fragment: string): void {
    if (fragment === 'top') {
      this.viewportScroller.scrollToPosition([0, 0]);
    } else {
      this.router.navigate([], { fragment }).then(() => {
        this.viewportScroller.scrollToAnchor(fragment);
      });
    }
    this.closeMobileMenu();
  }

  public toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  public closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
