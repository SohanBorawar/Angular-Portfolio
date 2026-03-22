import { Component, ChangeDetectionStrategy, inject, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit, ChangeDetectorRef, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { CommonModule, ViewportScroller, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, MatButtonModule, ScrollRevealDirective],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('staggerEntrance', [
      transition(':enter', [
        query('.hero-badge, h1, h2, .intro, .hero-cta, .hero-social, .hero-stats', [
          style({ opacity: 0, transform: 'translateY(60px)',
  encapsulation: ViewEncapsulation.None
}),
          stagger('120ms', [
            animate('800ms cubic-bezier(0.23, 1, 0.32, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class HeroComponent implements AfterViewInit, OnDestroy, OnInit {
  private viewportScroller = inject(ViewportScroller);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);
  public profileService = inject(ProfileService);
  private el = inject(ElementRef);

  @ViewChild('statsContainer') statsContainer!: ElementRef;
  @ViewChild('heroCanvas') heroCanvas!: ElementRef<HTMLCanvasElement>;

  private observer: IntersectionObserver | null = null;
  private animationExecuted = false;

  public profileData = this.profileService.getProfile();

  // Stats
  public targetProjects = 15;
  public targetDevices = 50;
  public targetExperience = 2;
  public displayedProjects = 0;
  public displayedDevices = 0;
  public displayedExperience = 0;

  // Typewriter
  private roles = ['IoT Developer', 'ThingsBoard Expert', 'Real-Time Systems Engineer'];
  public currentRole = '';
  private roleIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private typewriterTimeout: any;

  // Three.js
  private renderer!: any;
  private scene!: any;
  private camera!: any;
  private particlesMesh!: any;
  private animationFrameId: number | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private clock: any;
  private THREE: any;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.typewrite();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.statsContainer) {
        this.observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && !this.animationExecuted) {
            this.animationExecuted = true;
            this.animateStats();
            this.observer?.disconnect();
          }
        }, { threshold: 0.5 });
        this.observer.observe(this.statsContainer.nativeElement);
      }
      
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            this.loadThreeJS();
          }, { timeout: 2000 });
        } else {
          setTimeout(() => this.loadThreeJS(), 2000);
        }
      } else {
        this.useCSSBackground();
      }
      
      this.positionOrbitBadges();
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  private handleVisibilityChange = () => {
    if (document.hidden) {
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    } else {
      if (this.renderer) this.animateThreeJS();
    }
  }

  ngOnDestroy() {
    if (this.observer) this.observer.disconnect();
    clearTimeout(this.typewriterTimeout);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    
    // Cleanup Three.js
    if (this.renderer) {
      this.renderer.dispose();
      this.particlesMesh?.geometry?.dispose();
      this.particlesMesh?.material?.dispose();
      window.removeEventListener('resize', this.onWindowResize);
      window.removeEventListener('mousemove', this.onMouseMove);
    }
    
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  private typewrite() {
    const currentFullRole = this.roles[this.roleIndex];

    if (this.isDeleting) {
      this.currentRole = currentFullRole.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.currentRole = currentFullRole.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    this.cdr.markForCheck();

    let typeSpeed = this.isDeleting ? 50 : 100;

    if (!this.isDeleting && this.charIndex === currentFullRole.length) {
      typeSpeed = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.roleIndex = (this.roleIndex + 1) % this.roles.length;
      typeSpeed = 500;
    }

    this.typewriterTimeout = setTimeout(() => this.typewrite(), typeSpeed);
  }

  private useCSSBackground(): void {
    const canvas = this.heroCanvas?.nativeElement;
    if (canvas) canvas.style.display = 'none';
  }

  private async loadThreeJS(): Promise<void> {
    this.THREE = await import('three');
    this.clock = new this.THREE.Clock();

    if (!this.heroCanvas) return;
    
    this.scene = new this.THREE.Scene();
    
    this.camera = new this.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 50;

    this.renderer = new this.THREE.WebGLRenderer({
      canvas: this.heroCanvas.nativeElement,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesGeometry = new this.THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    const color1 = new this.THREE.Color(0x7C6FFF);
    const color2 = new this.THREE.Color(0xFF6FD8);
    const color3 = new this.THREE.Color(0x6FFFE9);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Create a galaxy-like spread
      const radius = Math.random() * 80;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 20;

      posArray[i] = Math.cos(angle) * radius;
      posArray[i + 1] = Math.sin(angle) * radius + height;
      posArray[i + 2] = (Math.random() - 0.5) * 80;

      // Assign mixed colors
      const randColor = Math.random();
      let mixedColor = color1.clone();
      if (randColor > 0.33 && randColor <= 0.66) mixedColor = color2.clone();
      if (randColor > 0.66) mixedColor = color3.clone();
      
      colorsArray[i] = mixedColor.r;
      colorsArray[i + 1] = mixedColor.g;
      colorsArray[i + 2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new this.THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new this.THREE.BufferAttribute(colorsArray, 3));

    const particlesMaterial = new this.THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: this.THREE.AdditiveBlending
    });

    this.particlesMesh = new this.THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particlesMesh);

    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));

    this.animateThreeJS();
  }

  private onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onMouseMove = (event: MouseEvent) => {
    this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  private animateThreeJS = () => {
    this.animationFrameId = requestAnimationFrame(this.animateThreeJS);

    const delta = this.clock ? this.clock.getDelta() : 0.016;
    const time = Date.now() * 0.0001;
    
    // Rotate entire particle field
    this.particlesMesh.rotation.y = time * 0.5;
    this.particlesMesh.rotation.z = time * 0.2;

    // Apply wave displacement to vertices
    const positions = this.particlesMesh.geometry.attributes['position'].array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const z = positions[i + 2];
      positions[i + 1] += Math.sin(time * 5 + x) * 0.01 + Math.cos(time * 3 + z) * 0.01;
    }
    this.particlesMesh.geometry.attributes['position'].needsUpdate = true;

    // Mouse parallax
    this.camera.position.x += (this.mouseX * 10 - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.mouseY * 10 - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);

    const scrollY = window.scrollY;
    if (scrollY > 0) {
      this.particlesMesh.position.y = scrollY * 0.05;
      this.particlesMesh.material.opacity = Math.max(0, 0.8 - scrollY * 0.002);
    } else {
      this.particlesMesh.position.y = 0;
      this.particlesMesh.material.opacity = 0.8;
    }

    this.renderer.render(this.scene, this.camera);
  }

  private animateStats() {
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = elapsed / duration;
      const progress = rawProgress < 1 ? 1 - Math.pow(1 - rawProgress, 3) : 1;

      this.displayedProjects = Math.floor(progress * this.targetProjects);
      this.displayedDevices = Math.floor(progress * this.targetDevices);
      this.displayedExperience = Math.floor(progress * this.targetExperience);

      this.cdr.markForCheck();

      if (rawProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.displayedProjects = this.targetProjects;
        this.displayedDevices = this.targetDevices;
        this.displayedExperience = this.targetExperience;
        this.cdr.markForCheck();
      }
    };

    requestAnimationFrame(animate);
  }

  private positionOrbitBadges(): void {
    const rings = [
      { selector: '.orbit-ring--1', radius: 140 },
      { selector: '.orbit-ring--2', radius: 185 },
      { selector: '.orbit-ring--3', radius: 230 },
    ];

    rings.forEach(ring => {
      const ringEl = this.el.nativeElement.querySelector(ring.selector);
      if (!ringEl) return;

      const badges = ringEl.querySelectorAll('.orbit-badge');
      badges.forEach((badge: HTMLElement) => {
        const angleDeg = parseFloat(
          badge.style.getPropertyValue('--badge-angle') || '0'
        );
        const angleRad = (angleDeg * Math.PI) / 180;
        const x = Math.cos(angleRad) * ring.radius;
        const y = Math.sin(angleRad) * ring.radius;

        badge.style.position = 'absolute';
        badge.style.left = `calc(50% + ${x}px)`;
        badge.style.top = `calc(50% + ${y}px)`;
        badge.style.transform = 'translate(-50%, -50%)';
        
        badge.style.setProperty('--ring-radius', `${ring.radius}px`);
      });
    });
  }

  public scrollTo(fragment: string): void {
    this.viewportScroller.scrollToAnchor(fragment);
  }
}
