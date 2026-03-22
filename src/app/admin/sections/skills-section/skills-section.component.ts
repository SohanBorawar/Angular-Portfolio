import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills-section',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './skills-section.component.html',
  styleUrls: ['./skills-section.component.scss']
})
export class SkillsSectionComponent implements OnInit {
  @Input() data: any;
  @Output() save = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  form!: FormGroup;

  get skillGroups(): FormArray {
    return this.form.get('skillGroups') as FormArray;
  }

  ngOnInit(): void {
    const groups = this.data?.skills || this.data?.skillGroups || [];
    this.form = this.fb.group({
      skillGroups: this.fb.array(
        groups.map((g: any) => this.createGroupForm(g))
      )
    });
  }

  createGroupForm(g: any = {}): FormGroup {
    const itemsArray = Array.isArray(g.items) ? g.items : Array.isArray(g.skills) ? g.skills : [];
    const skillStr = itemsArray.join(', ') || g.skills || '';
    return this.fb.group({
      category: [g.category || g.name || '', Validators.required],
      skills:   [skillStr]
    });
  }

  addGroup(): void {
    this.skillGroups.push(this.createGroupForm());
  }

  removeGroup(index: number): void {
    this.skillGroups.removeAt(index);
  }

  onSubmit(): void {
    const groups = this.skillGroups.value.map((g: any) => ({
      category: g.category,
      items: g.skills ? g.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : []
    }));
    this.save.emit({ ...this.data, skills: groups });
  }
}
