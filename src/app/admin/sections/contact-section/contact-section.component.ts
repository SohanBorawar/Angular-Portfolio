import { Component, Input, Output, EventEmitter,
         OnInit, OnChanges, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder,
         FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.scss']
})
export class ContactSectionComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Output() save = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  form!: FormGroup;
  saveSuccess = signal(false);

  ngOnInit(): void { this.buildForm(); }
  ngOnChanges(): void { if (this.form && this.data) this.patchForm(); }

  private buildForm(): void {
    this.form = this.fb.group({
      email:        ['', [Validators.required, Validators.email]],
      phone:        [''],
      location:     [''],
      availability: ['']
    });
    if (this.data) this.patchForm();
  }

  private patchForm(): void {
    const profile = this.data?.profile || {};
    const social = this.data?.social || {};

    this.form.patchValue({
      email:        social.email || '',
      phone:        profile.phone || social.phone || '',
      location:     profile.location || social.location || '',
      availability: profile.status || ''
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.invalid && c.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const f = this.form.value;
    let updated = { ...this.data };

    updated.social = {
      ...(this.data?.social || {}),
      email: f.email
    };
    
    updated.profile = {
      ...(this.data?.profile || {}),
      phone: f.phone,
      location: f.location,
      status: f.availability
    };

    this.save.emit(updated);
    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 3000);
  }
}
