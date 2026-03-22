import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './experience-section.component.html',
  styleUrls: ['./experience-section.component.scss']
})
export class ExperienceSectionComponent implements OnInit {
  @Input() data: any;
  @Output() save = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  form!: FormGroup;
  expandedIndex = signal<number | null>(0);

  get jobs(): FormArray {
    return this.form.get('jobs') as FormArray;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      jobs: this.fb.array(
        (this.data?.experience || this.data?.jobs || []).map((job: any) =>
          this.createJobGroup(job)
        )
      )
    });
  }

  createJobGroup(job: any = {}): FormGroup {
    let startDate = '';
    let endDate = '';
    
    // Parse duration string into start and end dates
    if (job.duration) {
      const parts = job.duration.split(' - ');
      if (parts.length === 2) {
        startDate = parts[0].trim();
        endDate = parts[1].trim();
      } else {
        startDate = job.duration;
      }
    } else {
      startDate = job.startDate || job.start || '';
      endDate = job.endDate || job.end || 'Present';
    }

    const current = endDate.toLowerCase() === 'present' || job.current;
    
    // Description is an array of strings in JSON, convert to single string for textarea
    const descStr = Array.isArray(job.description) ? job.description.join('\n') : (job.description || '');

    return this.fb.group({
      company:     [job.company || job.employer || '', Validators.required],
      role:        [job.role || job.title || job.position || '', Validators.required],
      startDate:   [startDate, Validators.required],
      endDate:     [endDate, Validators.required],
      location:    [job.location || ''],
      description: [descStr],
      current:     [current]
    });
  }

  addJob(): void {
    this.jobs.push(this.createJobGroup());
    this.expandedIndex.set(this.jobs.length - 1);
  }

  removeJob(index: number): void {
    this.jobs.removeAt(index);
  }

  toggleExpand(index: number): void {
    this.expandedIndex.set(
      this.expandedIndex() === index ? null : index
    );
  }

  onSubmit(): void {
    const items = this.jobs.value.map((job: any) => {
      // Reconstruct duration string
      const end = job.current ? 'Present' : job.endDate;
      const duration = job.startDate && end ? `${job.startDate} - ${end}` : job.startDate;
      
      // Reconstruct description array
      const descArray = job.description
        ? job.description.split('\n').map((s: string) => s.trim()).filter(Boolean)
        : [];

      return {
        role: job.role,
        company: job.company,
        duration: duration,
        description: descArray
      };
    });

    this.save.emit({ ...this.data, experience: items });
  }
}
