import { Component, inject, signal, computed,
         ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent {
  private profileService = inject(ProfileService);
  profileData = this.profileService.profileData;

  activeFilter = signal<string>('All');

  // Get projects from whichever field exists in JSON
  allProjects = computed(() => {
    const data = this.profileData();
    if (!data) return [];
    return data.projects    ||
           (data as any).portfolio   ||
           (data as any).works       ||
           [];
  });

  // Get unique filter categories from tech stacks
  filters = computed(() => {
    const projects = this.allProjects();
    if (!projects.length) return ['All'];
    
    const techs = new Set<string>();
    projects.forEach((p: any) => {
      // Look at techStack OR technologies
      const stack = Array.isArray(p.techStack) ? p.techStack : 
                    Array.isArray(p.technologies) ? p.technologies : [];
      if (stack.length) {
        stack.slice(0, 2).forEach((t: string) => techs.add(t));
      }
    });
    
    return ['All', ...Array.from(techs).slice(0, 5)];
  });

  // Filtered projects based on active tab
  filteredProjects = computed(() => {
    const filter = this.activeFilter();
    const projects = this.allProjects();
    
    if (filter === 'All') return projects;
    
    return projects.filter((p: any) => {
      const stack = Array.isArray(p.techStack) ? p.techStack : 
                    Array.isArray(p.technologies) ? p.technologies : [];
      return stack.some((t: string) =>
        t.toLowerCase().includes(filter.toLowerCase())
      );
    });
  });

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }
}
