import {
  Component, Input, Output, EventEmitter,
  OnInit, OnChanges, inject, signal
} from '@angular/core';
import {
  ReactiveFormsModule, FormBuilder,
  FormGroup, FormArray, Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './experience-section.component.html',
  styleUrls: ['./experience-section.component.scss']
})
export class ExperienceSectionComponent
  implements OnInit, OnChanges {

  @Input() data: any;
  @Output() save = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  form!: FormGroup;
  expandedJobIndex    = signal<number | null>(0);
  expandedEduIndex    = signal<number | null>(null);
  activeTab           = signal<'jobs' | 'education'>('jobs');
  saveSuccess         = signal(false);

  // Detect which field names the JSON uses
  private _expKey = 'experience';
  private _eduKey = 'education';

  // ── Jobs FormArray ────────────────────────────────────────
  get jobs(): FormArray {
    return this.form.get('jobs') as FormArray;
  }

  // ── Education FormArray ───────────────────────────────────
  get education(): FormArray {
    return this.form.get('education') as FormArray;
  }

  ngOnInit(): void { this.buildForm(); }
  ngOnChanges(): void {
    if (this.form && this.data) this.rebuildForm();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      jobs:      this.fb.array([]),
      education: this.fb.array([])
    });
    if (this.data) this.rebuildForm();
  }

  private rebuildForm(): void {
    // Detect experience key
    this._expKey =
      'experience'  in this.data ? 'experience'  :
      'jobs'        in this.data ? 'jobs'         :
      'workHistory' in this.data ? 'workHistory'  :
      'work'        in this.data ? 'work'         : 'experience';

    // Detect education key
    this._eduKey =
      'education' in this.data ? 'education' :
      'degrees'   in this.data ? 'degrees'   :
      'schooling' in this.data ? 'schooling' : 'education';

    const expData = this.data[this._expKey] || [];
    const eduData = this.data[this._eduKey] || [];

    // Rebuild jobs array
    const jobsArray = this.form.get('jobs') as FormArray;
    jobsArray.clear();
    expData.forEach((j: any) =>
      jobsArray.push(this.createJobGroup(j))
    );

    // Rebuild education array
    const eduArray = this.form.get('education') as FormArray;
    eduArray.clear();
    eduData.forEach((e: any) =>
      eduArray.push(this.createEduGroup(e))
    );
  }

  // ── Job Form Group ────────────────────────────────────────
  createJobGroup(job: any = {}): FormGroup {
    return this.fb.group({
      company:     [job.company     ||
                    job.employer    || '', Validators.required],
      role:        [job.role        ||
                    job.title       ||
                    job.position    || '', Validators.required],
      startDate:   [job.startDate   ||
                    job.start       || '', Validators.required],
      endDate:     [job.endDate     ||
                    job.end         || 'Present'],
      current:     [job.current     ||
                    job.endDate === 'Present' || false],
      location:    [job.location    || ''],
      description: [job.description ||
                    job.summary     || ''],
      highlights:  [Array.isArray(job.highlights)
                    ? job.highlights.join('\n')
                    : (job.highlights || '')],
    });
  }

  // ── Education Form Group ──────────────────────────────────
  createEduGroup(edu: any = {}): FormGroup {
    return this.fb.group({
      institution: [edu.institution ||
                    edu.school      ||
                    edu.university  || '', Validators.required],
      degree:      [edu.degree      ||
                    edu.title       ||
                    edu.qualification || '', Validators.required],
      field:       [edu.field       ||
                    edu.major       ||
                    edu.subject     || ''],
      startDate:   [edu.startDate   ||
                    edu.start       || ''],
      endDate:     [edu.endDate     ||
                    edu.end         ||
                    edu.year        || ''],
      grade:       [edu.grade       ||
                    edu.gpa         ||
                    edu.score       || ''],
      description: [edu.description ||
                    edu.summary     || ''],
    });
  }

  // ── Job actions ───────────────────────────────────────────
  addJob(): void {
    this.jobs.push(this.createJobGroup());
    this.expandedJobIndex.set(this.jobs.length - 1);
    this.activeTab.set('jobs');
  }

  removeJob(index: number): void {
    this.jobs.removeAt(index);
    this.expandedJobIndex.set(null);
  }

  toggleJob(index: number): void {
    this.expandedJobIndex.set(
      this.expandedJobIndex() === index ? null : index
    );
  }

  // ── Education actions ─────────────────────────────────────
  addEducation(): void {
    this.education.push(this.createEduGroup());
    this.expandedEduIndex.set(this.education.length - 1);
    this.activeTab.set('education');
  }

  removeEducation(index: number): void {
    this.education.removeAt(index);
    this.expandedEduIndex.set(null);
  }

  toggleEdu(index: number): void {
    this.expandedEduIndex.set(
      this.expandedEduIndex() === index ? null : index
    );
  }

  setTab(tab: 'jobs' | 'education'): void {
    this.activeTab.set(tab);
  }

  // ── Save ──────────────────────────────────────────────────
  onSubmit(): void {
    const jobs = this.jobs.value.map((j: any) => ({
      company:     j.company,
      role:        j.role,
      startDate:   j.startDate,
      endDate:     j.current ? 'Present' : j.endDate,
      current:     j.current,
      location:    j.location,
      description: j.description,
      highlights:  j.highlights
        ? j.highlights.split('\n')
            .map((h: string) => h.trim())
            .filter(Boolean)
        : []
    }));

    const education = this.education.value.map((e: any) => ({
      institution: e.institution,
      degree:      e.degree,
      field:       e.field,
      startDate:   e.startDate,
      endDate:     e.endDate,
      grade:       e.grade,
      description: e.description,
    }));

    const updated = {
      ...this.data,
      [this._expKey]: jobs,
      [this._eduKey]: education,
    };

    this.save.emit(updated);
    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 3000);
  }
}
