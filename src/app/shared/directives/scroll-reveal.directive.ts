import { Directive, ElementRef, OnInit, inject, PLATFORM_ID, Input, OnDestroy, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
    selector: '[appScrollReveal]',
    standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
    private el = inject(ElementRef);
    private platformId = inject(PLATFORM_ID);
    private zone = inject(NgZone);
    private scrollTriggerInstance?: any;

    @Input('appScrollReveal') delayIndex: number | string = 0;
    @Input() revealDirection: 'up' | 'down' | 'left' | 'right' | 'fade' = 'up';

    ngOnInit(): void {
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

        this.zone.runOutsideAngular(() => {
            const element = this.el.nativeElement;
            const index = Number(this.delayIndex) || 0;
            
            let y = 0, x = 0, scale = 1;
            switch (this.revealDirection) {
                case 'up': y = 50; break;
                case 'down': y = -50; break;
                case 'left': x = 50; break;
                case 'right': x = -50; break;
                case 'fade': scale = 0.95; break;
            }

            // Initial hiding state
            gsap.set(element, { 
                opacity: 0, 
                y: y, 
                x: x,
                scale: scale 
            });

            // Let the DOM settle before measuring for triggers
            setTimeout(() => {
                this.scrollTriggerInstance = ScrollTrigger.create({
                    trigger: element,
                    start: "top 85%", 
                    onEnter: () => {
                        gsap.to(element, {
                            duration: 0.8,
                            opacity: 1,
                            y: 0,
                            x: 0,
                            scale: 1,
                            delay: index * 0.1, // Stagger effect based on index
                            ease: "power3.out",
                            overwrite: "auto"
                        });
                    },
                    once: true
                });
            }, 100);
        });
    }

    ngOnDestroy() {
        if (this.scrollTriggerInstance) {
            this.scrollTriggerInstance.kill();
        }
    }
}
