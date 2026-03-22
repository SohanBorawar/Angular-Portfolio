import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './projects-section.component.html',
  styleUrls: ['./projects-section.component.scss']
})
export class ProjectsSectionComponent implements OnInit {
  @Input() data: any;
  @Output() save = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  form!: FormGroup;
  expandedIndex = signal<number | null>(0);

  get projects(): FormArray {
    return this.form.get('projects') as FormArray;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      projects: this.fb.array(
        (this.data?.projects || []).map((p: any) => this.createProjectGroup(p))
      )
    });
  }

  createProjectGroup(p: any = {}): FormGroup {
    const techStr = Array.isArray(p.technologies) ? p.technologies.join(', ') : 
                    Array.isArray(p.techStack) ? p.techStack.join(', ') : 
                    (p.technologies || p.techStack || '');

    return this.fb.group({
      title:       [p.title || '',       Validators.required],
      description: [p.description || '', Validators.required],
      techStack:   [techStr],
      liveUrl:     [p.live || p.liveUrl || ''],
      githubUrl:   [p.github || p.githubUrl || ''],
      featured:    [p.featured || false],
      status:      [p.status || 'completed']
    });
  }

  addProject(): void {
    this.projects.push(this.createProjectGroup());
    this.expandedIndex.set(this.projects.length - 1);
  }

  removeProject(index: number): void {
    this.projects.removeAt(index);
  }

  toggleExpand(index: number): void {
    this.expandedIndex.set(this.expandedIndex() === index ? null : index);
  }

  onSubmit(): void {
    const projects = this.projects.value.map((p: any) => ({
      title: p.title,
      description: p.description,
      technologies: p.techStack ? p.techStack.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      github: p.githubUrl,
      live: p.liveUrl
    }));
    this.save.emit({ ...this.data, projects });
  }
}
