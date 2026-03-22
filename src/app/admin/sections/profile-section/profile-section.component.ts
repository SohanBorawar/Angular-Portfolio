import { Component, Input, Output, EventEmitter, 
         OnInit, OnChanges, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, 
         FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-section',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile-section.component.html',
  styleUrls: ['./profile-section.component.scss'],
})
export class ProfileSectionComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Output() save = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  form!: FormGroup;
  saveSuccess = signal(false);
  previewUrl = signal('');

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(): void {
    if (this.form && this.data) {
      this.patchForm();
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      name:         ['', Validators.required],
      title:        ['', Validators.required],
      bio:          ['', Validators.required],
      email:        ['', [Validators.required, Validators.email]],
      phone:        [''],
      location:     [''],
      avatarUrl:    [''],
      availability: [''],
      github:       [''],
      linkedin:     [''],
      twitter:      [''],
      website:      [''],
    });

    if (this.data) {
      this.patchForm();
    }
  }

  private patchForm(): void {
    const profile = this.data?.profile || {};
    const social = this.data?.social || {};

    this.form.patchValue({
      name:         profile.name || '',
      title:        profile.title || '',
      bio:          profile.summary || '',
      email:        social.email || '',
      phone:        profile.phone || social.phone || '',
      location:     profile.location || social.location || '',
      avatarUrl:    profile.avatarUrl || '',
      availability: profile.status || '',
      github:       social.github || '',
      linkedin:     social.linkedin || '',
      twitter:      social.twitter || '',
      website:      social.website || '',
    });

    const url = this.form.get('avatarUrl')?.value;
    if (url) this.previewUrl.set(url);

    this.form.get('avatarUrl')?.valueChanges.subscribe(val => {
      this.previewUrl.set(val || '');
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

    const formVal = this.form.value;
    let updatedData = { ...this.data };

    updatedData.profile = {
      ...(this.data?.profile || {}),
      name: formVal.name,
      title: formVal.title,
      summary: formVal.bio,
      avatarUrl: formVal.avatarUrl,
      status: formVal.availability,
      phone: formVal.phone,
      location: formVal.location
    };

    updatedData.social = {
      ...(this.data?.social || {}),
      email: formVal.email,
      github: formVal.github,
      linkedin: formVal.linkedin,
      twitter: formVal.twitter,
      website: formVal.website
    };

    this.save.emit(updatedData);

    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 3000);
  }
}
