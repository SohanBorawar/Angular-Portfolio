import {
  Component, Input, Output, EventEmitter,
  OnInit, OnChanges, inject, signal
} from '@angular/core';
import {
  ReactiveFormsModule, FormBuilder,
  FormGroup, Validators
} from '@angular/forms';
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
  saveError = signal(false);

  ngOnInit(): void { this.buildForm(); }
  ngOnChanges(): void {
    if (this.form && this.data) this.patchForm();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      email:        ['', [Validators.required, Validators.email]],
      phone:        [''],
      location:     [''],
      availability: [''],
      website:      [''],
      github:       [''],
      linkedin:     [''],
      twitter:      [''],
    });
    if (this.data) this.patchForm();
  }

  private patchForm(): void {
    // Handle both flat and nested social structure
    const social = this.data?.social || {};

    this.form.patchValue({
      email:        this.data?.email        ||
                    this.data?.contactEmail || '',
      phone:        this.data?.phone        || '',
      location:     this.data?.location     || '',
      availability: this.data?.availability || '',
      website:      this.data?.website      ||
                    social?.website         || '',
      github:       this.data?.github       ||
                    this.data?.githubUrl    ||
                    social?.github          || '',
      linkedin:     this.data?.linkedin     ||
                    this.data?.linkedinUrl  ||
                    social?.linkedin        || '',
      twitter:      this.data?.twitter      ||
                    this.data?.twitterUrl   ||
                    social?.twitter         || '',
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

    // Update email — handle both field names
    if ('email' in this.data)
      updated.email = f.email;
    if ('contactEmail' in this.data)
      updated.contactEmail = f.email;

    // Update flat fields
    updated.phone        = f.phone;
    updated.location     = f.location;
    updated.availability = f.availability;

    // Update social — handle both nested and flat
    if (this.data?.social &&
        typeof this.data.social === 'object') {
      updated.social = {
        ...this.data.social,
        github:   f.github,
        linkedin: f.linkedin,
        twitter:  f.twitter,
        website:  f.website,
      };
    } else {
      updated.github   = f.github;
      updated.linkedin = f.linkedin;
      updated.twitter  = f.twitter;
      updated.website  = f.website;
      if ('githubUrl'   in this.data)
        updated.githubUrl   = f.github;
      if ('linkedinUrl' in this.data)
        updated.linkedinUrl = f.linkedin;
      if ('twitterUrl'  in this.data)
        updated.twitterUrl  = f.twitter;
    }

    this.save.emit(updated);
    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 3000);
  }
}
