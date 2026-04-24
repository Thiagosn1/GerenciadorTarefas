import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Task, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnChanges {
  private readonly formBuilder = inject(FormBuilder);

  @Input() taskToEdit: Task | null = null;
  @Input() loading = false;

  @Output() save = new EventEmitter<{ titulo: string; descricao: string; status: TaskStatus }>();
  @Output() cancel = new EventEmitter<void>();

  protected readonly statusOptions: Array<{ label: string; value: TaskStatus }> = [
    { label: 'Pendente', value: 'Pendente' },
    { label: 'Concluída', value: 'Concluída' }
  ];

  protected readonly form = this.formBuilder.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(120), this.notBlankValidator()]],
    descricao: ['', [Validators.required, Validators.maxLength(400), this.notBlankValidator()]],
    status: ['Pendente' as TaskStatus, [Validators.required]]
  });

  protected get isEditMode(): boolean {
    return this.taskToEdit !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['taskToEdit']) {
      return;
    }

    if (this.taskToEdit) {
      this.form.setValue({
        titulo: this.taskToEdit.titulo,
        descricao: this.taskToEdit.descricao ?? '',
        status: this.taskToEdit.status
      });
      return;
    }

    this.form.reset({
      titulo: '',
      descricao: '',
      status: 'Pendente'
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.getRawValue();
    this.save.emit({
      titulo: rawValue.titulo.trim(),
      descricao: rawValue.descricao.trim(),
      status: rawValue.status
    });
  }

  protected onCancel(): void {
    this.cancel.emit();
  }

  private notBlankValidator(): ValidatorFn {
    return (control: AbstractControl<string>): ValidationErrors | null => {
      if (typeof control.value !== 'string') {
        return null;
      }

      return control.value.trim().length === 0 ? { blank: true } : null;
    };
  }
}
