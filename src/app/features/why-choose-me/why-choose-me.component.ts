import { Component, ChangeDetectionStrategy, AfterViewInit, ElementRef, OnDestroy, PLATFORM_ID, inject, NgZone, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-why-choose-me',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './why-choose-me.component.html',
  styleUrls: ['./why-choose-me.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class WhyChooseMeComponent implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private zone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);
  private cleanupListeners: Array<() => void> = [];

  features: FeatureCard[] = [
    {
      icon: 'architecture',
      title: 'Enterprise Architecture',
      description: 'Building microservice-based scalable IoT solutions that gracefully perform from 10 to 100,000+ active devices.'
    },
    {
      icon: 'thingsboard',
      title: 'ThingsBoard Mastery',
      description: 'Deep knowledge of ThingsBoard PE/CE, architecting rule engines, custom widgets, and complex device profiles.'
    },
    {
      icon: 'analytics',
      title: 'Real-time Analytics',
      description: 'Designing dashboard ecosystems that process telemetry at scale, offering actionable insights instantly.'
    },
    {
      icon: 'security',
      title: 'Zero-Trust Security',
      description: 'Implementing MQTT/TLS, token-based authentication, and robust end-to-end data encryption strategies.'
    },
    {
      icon: 'device',
      title: 'Fleet Management',
      description: 'Streamlining OTA updates, secure provisioning, and lifecycle management for vast networks of hardware.'
    },
    {
      icon: 'global',
      title: 'Global Scale',
      description: 'Experience shipping and integrating containerized IoT applications across multiple global cloud regions.'
    }
  ];

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    this.initGSAP();
  }

  private async initGSAP() {
    const { default: gsap } = await import('gsap');

    this.zone.runOutsideAngular(() => {
      // Small delay to ensure view is fully rendered
      setTimeout(() => {
        const cards = this.el.nativeElement.querySelectorAll('.feature-card');
        
        cards.forEach((card: HTMLElement) => {
          const onMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limit tilt angle
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            gsap.to(card, {
              duration: 0.4,
              rotateX,
              rotateY,
              transformPerspective: 1000,
              ease: "power2.out",
              overwrite: "auto"
            });
            
            // Subtle parallax for icon
            const icon = card.querySelector('.icon-wrapper');
            if (icon) {
                 gsap.to(icon, {
                     duration: 0.4,
                     x: (x - centerX) / 10,
                     y: (y - centerY) / 10,
                     ease: "power2.out",
                     overwrite: "auto"
                 });
            }
          };

          const onLeave = () => {
            gsap.to(card, {
              duration: 0.8,
              rotateX: 0,
              rotateY: 0,
              ease: "elastic.out(1, 0.5)",
              overwrite: "auto"
            });
            
            const icon = card.querySelector('.icon-wrapper');
            if (icon) {
                 gsap.to(icon, {
                     duration: 0.8,
                     x: 0,
                     y: 0,
                     ease: "elastic.out(1, 0.5)",
                     overwrite: "auto"
                 });
            }
          };

          card.addEventListener('mousemove', onMove);
          card.addEventListener('mouseleave', onLeave);

          this.cleanupListeners.push(() => {
            card.removeEventListener('mousemove', onMove);
            card.removeEventListener('mouseleave', onLeave);
          });
        });
      }, 100);
    });
  }

  ngOnDestroy() {
    this.cleanupListeners.forEach(cleanup => cleanup());
  }
}
