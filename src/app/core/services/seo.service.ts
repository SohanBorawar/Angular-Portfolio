import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title: string;
  description: string;
  keywords: string;
  author: string;
  image: string;
  url: string;
  twitterHandle?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta   = inject(Meta);
  private title  = inject(Title);
  private doc    = inject(DOCUMENT);

  updateSeo(config: SeoConfig): void {
    // ── Basic Meta ──────────────────────────────────────────────
    this.title.setTitle(config.title);
    this.meta.updateTag({ name: 'description',   content: config.description });
    this.meta.updateTag({ name: 'keywords',      content: config.keywords });
    this.meta.updateTag({ name: 'author',        content: config.author });
    this.meta.updateTag({ name: 'robots',        content: 'index, follow' });
    this.meta.updateTag({ name: 'theme-color',   content: '#0D0D0F' });

    // ── Open Graph (Facebook, LinkedIn previews) ────────────────
    this.meta.updateTag({ property: 'og:title',       content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image',       content: config.image });
    this.meta.updateTag({ property: 'og:url',         content: config.url });
    this.meta.updateTag({ property: 'og:type',        content: 'website' });
    this.meta.updateTag({ property: 'og:site_name',   content: config.author });
    this.meta.updateTag({ property: 'og:locale',      content: 'en_US' });

    // ── Twitter Card ────────────────────────────────────────────
    this.meta.updateTag({ name: 'twitter:card',        content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title',       content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image',       content: config.image });
    if (config.twitterHandle) {
      this.meta.updateTag({ name: 'twitter:creator',  content: config.twitterHandle });
    }

    // ── Canonical URL ───────────────────────────────────────────
    this.updateCanonical(config.url);

    // ── JSON-LD Structured Data ─────────────────────────────────
    this.updateStructuredData(config);
  }

  private updateCanonical(url: string): void {
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private updateStructuredData(config: SeoConfig): void {
    // Remove existing structured data
    const existing = this.doc.getElementById('structured-data');
    if (existing) existing.remove();

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': config.author,
      'url': config.url,
      'image': config.image,
      'description': config.description,
      'jobTitle': 'IoT Developer & ThingsBoard Expert',
      'knowsAbout': [
        'ThingsBoard', 'IoT Development', 'MQTT Protocol',
        'Angular', 'Node.js', 'Docker', 'Real-time Systems',
        'Device Management', 'Telemetry Systems'
      ],
      'sameAs': []
    };

    const script = this.doc.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema, null, 2);
    this.doc.head.appendChild(script);
  }
}
