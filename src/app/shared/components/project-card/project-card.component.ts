import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ProjectCardComponent {
  @Input() project: any = {};

  // Gradient per primary technology
  getGradient(): string {
    const tech = (
      this.project?.techStack?.[0] || 
      this.project?.technologies?.[0] || 
      this.project?.title || ''
    ).toLowerCase();

    const map: Record<string, string> = {
      'thingsboard': 'linear-gradient(135deg,#667eea,#764ba2)',
      'angular':     'linear-gradient(135deg,#DD0031,#C3002F)',
      'mqtt':        'linear-gradient(135deg,#4facfe,#00f2fe)',
      'docker':      'linear-gradient(135deg,#0db7ed,#384d54)',
      'node':        'linear-gradient(135deg,#68a063,#3c873a)',
      'python':      'linear-gradient(135deg,#3776ab,#ffd343)',
      'grafana':     'linear-gradient(135deg,#f7971e,#ffd200)',
      'aws':         'linear-gradient(135deg,#ff9900,#232f3e)',
      'postgresql':  'linear-gradient(135deg,#336791,#6baed6)',
      'postgres':    'linear-gradient(135deg,#336791,#6baed6)',
      'redis':       'linear-gradient(135deg,#ff416c,#ff4b2b)',
      'kafka':       'linear-gradient(135deg,#231F20,#404040)',
      'typescript':  'linear-gradient(135deg,#3178c6,#235a97)',
      'javascript':  'linear-gradient(135deg,#f7df1e,#e8c900)',
      'react':       'linear-gradient(135deg,#61dafb,#21a1c4)',
      'vue':         'linear-gradient(135deg,#42b883,#35495e)',
    };

    for (const [key, grad] of Object.entries(map)) {
      if (tech.includes(key)) return grad;
    }
    return 'linear-gradient(135deg,#7C6FFF,#FF6FD8,#6FFFE9)';
  }

  getIcon(tech: string): string {
    const t = tech.toLowerCase().trim();
    const icons: Record<string, string> = {
      'angular': 'A', 'thingsboard': '⚡',
      'mqtt': '📡', 'docker': '🐳',
      'node.js': '⬡', 'nodejs': '⬡',
      'python': '🐍', 'typescript': 'TS',
      'javascript': 'JS', 'grafana': '📊',
      'aws': '☁️', 'postgresql': '🐘',
      'postgres': '🐘', 'redis': '⚡',
      'kafka': '📨', 'linux': '🐧',
      'rest api': '🔗', 'restapi': '🔗',
      'react': '⚛', 'vue': '💚',
      'html': '🌐', 'css': '🎨',
    };
    return icons[t] || tech.charAt(0).toUpperCase();
  }

  getBadgeColor(tech: string): string {
    const t = tech.toLowerCase().trim();
    const colors: Record<string, string> = {
      'angular':    'rgba(221,0,49,0.15)',
      'thingsboard':'rgba(124,111,255,0.15)',
      'mqtt':       'rgba(79,172,254,0.15)',
      'docker':     'rgba(13,183,237,0.15)',
      'node.js':    'rgba(104,160,99,0.15)',
      'nodejs':     'rgba(104,160,99,0.15)',
      'python':     'rgba(55,118,171,0.15)',
      'typescript': 'rgba(49,120,198,0.15)',
      'grafana':    'rgba(247,151,30,0.15)',
      'aws':        'rgba(255,153,0,0.15)',
      'postgresql': 'rgba(51,103,145,0.15)',
      'postgres':   'rgba(51,103,145,0.15)',
      'redis':      'rgba(255,65,108,0.15)',
      'kafka':      'rgba(64,64,64,0.3)',
    };
    return colors[t] || 'rgba(124,111,255,0.1)';
  }

  get techStack(): string[] {
    const ts = this.project?.techStack ||
               this.project?.technologies ||
               this.project?.tech ||
               this.project?.stack ||
               [];
    return Array.isArray(ts) ? ts : 
           typeof ts === 'string' ? 
           ts.split(',').map((s: string) => s.trim()) : [];
  }

  get isLive(): boolean {
    return !!(this.project?.liveUrl || this.project?.live || this.project?.demoUrl);
  }

  get liveUrl(): string {
    return this.project?.liveUrl || this.project?.live || this.project?.demoUrl || '';
  }

  get githubUrl(): string {
    return this.project?.githubUrl || 
           this.project?.repoUrl   || 
           this.project?.github    || '';
  }

  get status(): string {
    return this.project?.status || 'completed';
  }

  get title(): string {
    return this.project?.title || 
           this.project?.name  || 'Untitled Project';
  }

  get description(): string {
    return this.project?.description || 
           this.project?.summary     || 
           this.project?.about       || 
           'No description available.';
  }
}
