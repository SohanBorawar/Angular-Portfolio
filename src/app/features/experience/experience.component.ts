import { Component, ChangeDetectionStrategy, inject, AfterViewInit, ViewChild, ElementRef, OnDestroy, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ExperienceComponent implements AfterViewInit, OnDestroy {
  public profileData = inject(ProfileService).getProfile();
  private platformId = inject(PLATFORM_ID);
  
  @ViewChild('timelineLine') timelineLine!: ElementRef;

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;
        this.initGSAP();
    }
  }

  private async initGSAP() {
    const { default: gsap } = await import('gsap');
    const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);
    // Small timeout to ensure DOM is settled
    setTimeout(() => this.initTimelineAnimation(gsap), 100);
  }

  initTimelineAnimation(gsap: any) {
    if (!this.timelineLine?.nativeElement) return;
    
    gsap.fromTo(this.timelineLine.nativeElement,
        { scaleY: 0, transformOrigin: "top center" },
        { 
            scaleY: 1, 
            ease: "none",
            scrollTrigger: {
                trigger: ".timeline",
                start: "top center+=100",
                end: "bottom center",
                scrub: 0.5
            }
        }
    );
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      import('gsap/ScrollTrigger').then(m => {
          const ScrollTrigger = m.default;
          ScrollTrigger.getAll().forEach((t: any) => t.kill());
          ScrollTrigger.clearMatchMedia();
      }).catch(e => {});
    }
  }
}
