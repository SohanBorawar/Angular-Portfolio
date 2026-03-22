import {
  Component, inject, signal, computed,
  ChangeDetectionStrategy, ViewEncapsulation,
  AfterViewInit, OnDestroy, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';

interface Skill {
  name: string;
  level: number;
  icon: string;
  color: string;
  category: string;
}

interface SkillGroup {
  category: string;
  items: string[] | Skill[];
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SkillsComponent implements AfterViewInit, OnDestroy {
  private profileService = inject(ProfileService);
  private el = inject(ElementRef);
  profileData = this.profileService.profileData;

  activeCategory = signal<string>('All');
  private observers: IntersectionObserver[] = [];

  // ── Skill metadata map ──────────────────────────────────────
  private skillMeta: Record<string, { icon: string; color: string; level: number }> = {
    // IoT
    'thingsboard':  { icon: '⚡', color: '#7C6FFF', level: 95 },
    'mqtt':         { icon: '📡', color: '#4facfe', level: 90 },
    'node-red':     { icon: '🔴', color: '#8F0000', level: 80 },
    'iot':          { icon: '🔌', color: '#6FFFE9', level: 92 },
    'zigbee':       { icon: '📶', color: '#7C6FFF', level: 75 },
    'modbus':       { icon: '🔧', color: '#A09FC0', level: 78 },
    'opcua':        { icon: '🏭', color: '#FF6FD8', level: 72 },
    // Backend
    'node.js':      { icon: '⬡', color: '#68a063', level: 88 },
    'nodejs':       { icon: '⬡', color: '#68a063', level: 88 },
    'python':       { icon: '🐍', color: '#3776ab', level: 85 },
    'rest api':     { icon: '🔗', color: '#6FFFE9', level: 90 },
    'restapi':      { icon: '🔗', color: '#6FFFE9', level: 90 },
    'kafka':        { icon: '📨', color: '#404040', level: 75 },
    'rabbitmq':     { icon: '🐰', color: '#FF6600', level: 70 },
    // Frontend
    'angular':      { icon: 'A',  color: '#DD0031', level: 92 },
    'typescript':   { icon: 'TS', color: '#3178c6', level: 88 },
    'javascript':   { icon: 'JS', color: '#f7df1e', level: 85 },
    'html':         { icon: '🌐', color: '#E34F26', level: 90 },
    'css':          { icon: '🎨', color: '#1572B6', level: 85 },
    'scss':         { icon: '🎨', color: '#CC6699', level: 85 },
    'react':        { icon: '⚛',  color: '#61dafb', level: 70 },
    // DevOps
    'docker':       { icon: '🐳', color: '#0db7ed', level: 88 },
    'linux':        { icon: '🐧', color: '#FCC624', level: 85 },
    'aws':          { icon: '☁️', color: '#FF9900', level: 78 },
    'git':          { icon: '⎇',  color: '#F05032', level: 90 },
    'nginx':        { icon: '🟢', color: '#009900', level: 75 },
    'kubernetes':   { icon: '☸',  color: '#326CE5', level: 65 },
    'ci/cd':        { icon: '🔄', color: '#6FFFE9', level: 78 },
    // Databases
    'postgresql':   { icon: '🐘', color: '#336791', level: 85 },
    'postgres':     { icon: '🐘', color: '#336791', level: 85 },
    'redis':        { icon: '⚡', color: '#FF4136', level: 82 },
    'mongodb':      { icon: '🍃', color: '#4DB33D', level: 78 },
    'mysql':        { icon: '🐬', color: '#4479A1', level: 80 },
    'influxdb':     { icon: '📈', color: '#22ADF6', level: 75 },
    // Monitoring
    'grafana':      { icon: '📊', color: '#F46800', level: 88 },
    'prometheus':   { icon: '🔥', color: '#E6522C', level: 75 },
  };

  // ── Get skill metadata ──────────────────────────────────────
  getSkillMeta(name: string) {
    const key = name.toLowerCase().trim();
    return this.skillMeta[key] || {
      icon: name.charAt(0).toUpperCase(),
      color: '#7C6FFF',
      level: 75
    };
  }

  // ── Parse skill groups from ProfileService ─────────────────
  rawSkillGroups = computed((): SkillGroup[] => {
    const data = this.profileData();
    if (!data) return [];
    const groups = data.skills || [];
    if (!Array.isArray(groups)) return [];
    return groups;
  });

  // ── All category names ─────────────────────────────────────
  categories = computed((): string[] => {
    const groups = this.rawSkillGroups();
    if (!groups.length) return ['All'];
    const cats = groups.map((g: any) =>
      g.category || g.name || g.group || 'General'
    );
    return ['All', ...cats];
  });

  // ── Flattened skills with metadata ─────────────────────────
  allSkillsFlat = computed(() => {
    const groups = this.rawSkillGroups();
    const result: Array<{
      name: string;
      icon: string;
      color: string;
      level: number;
      category: string;
    }> = [];

    groups.forEach((group: any) => {
      const cat = group.category || group.name || 'General';
      const skillItems = group.skills || group.items || [];
      const skillArr = Array.isArray(skillItems) ? skillItems : [];

      skillArr.forEach((s: any) => {
        const name = typeof s === 'string' ? s : (s.name || '');
        if (!name) return;
        const meta = this.getSkillMeta(name);
        result.push({
          name,
          icon: meta.icon,
          color: meta.color,
          level: meta.level,
          category: cat
        });
      });
    });

    return result;
  });

  // ── Filtered skills ────────────────────────────────────────
  filteredSkills = computed(() => {
    const cat = this.activeCategory();
    const all = this.allSkillsFlat();
    if (cat === 'All') return all;
    return all.filter(s => s.category === cat);
  });

  // ── Marquee skills (top 12 for strip) ─────────────────────
  marqueeSkills = computed(() => {
    const all = this.allSkillsFlat();
    return [...all, ...all].slice(0, 24);
  });

  setCategory(cat: string): void {
    this.activeCategory.set(cat);
  }

  // ── Animate progress bars on scroll ───────────────────────
  ngAfterViewInit(): void {
    const bars = this.el.nativeElement
      .querySelectorAll('.skill-progress-fill');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const level = el.getAttribute('data-level') || '75';
          setTimeout(() => {
            el.style.width = level + '%';
          }, 100);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach((bar: Element) => observer.observe(bar));
    this.observers.push(observer);
  }

  ngOnDestroy(): void {
    this.observers.forEach(o => o.disconnect());
  }
}
