import { CommonModule, formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CreateTaskPayload, Task, TaskStatus, UpdateTaskPayload } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

type StatusFilter = 'TODAS' | TaskStatus;
type SortColumn = 'titulo' | 'descricao' | 'status' | 'dataCriacao';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly sortStorageKey = 'task-list-sort';

  protected readonly tasks = signal<Task[]>([]);
  protected readonly statusFilter = signal<StatusFilter>('TODAS');
  protected readonly page = signal(1);
  protected readonly pageSize = signal(7);
  protected readonly loading = signal(false);
  protected readonly saveLoading = signal(false);
  protected readonly showForm = signal(false);
  protected readonly editingTask = signal<Task | null>(null);
  protected readonly taskToDelete = signal<Task | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly deleting = signal(false);
  protected readonly sortColumn = signal<SortColumn>('dataCriacao');
  protected readonly sortDirection = signal<SortDirection>('desc');

  protected readonly totalPages = computed(() => {
    const total = Math.ceil(this.filteredTasks().length / this.pageSize());
    return total > 0 ? total : 1;
  });

  protected readonly filteredTasks = computed(() => {
    if (this.statusFilter() === 'TODAS') {
      return this.tasks();
    }

    return this.tasks().filter((task) => task.status === this.statusFilter());
  });

  protected readonly sortedTasks = computed(() => {
    const column = this.sortColumn();
    const direction = this.sortDirection();
    const multiplier = direction === 'asc' ? 1 : -1;

    return [...this.filteredTasks()].sort((a, b) => {
      if (column === 'dataCriacao') {
        return (
          (this.getDateSortValue(a.dataCriacao) - this.getDateSortValue(b.dataCriacao)) * multiplier
        );
      }

      const left = String(a[column] ?? '').toLocaleLowerCase('pt-BR');
      const right = String(b[column] ?? '').toLocaleLowerCase('pt-BR');
      return left.localeCompare(right, 'pt-BR') * multiplier;
    });
  });

  protected readonly paginatedTasks = computed(() => {
    const currentPageSize = this.pageSize();
    const start = (this.page() - 1) * currentPageSize;
    return this.sortedTasks().slice(start, start + currentPageSize);
  });

  protected readonly totalItems = computed(() => this.filteredTasks().length);

  ngOnInit(): void {
    this.loadSortPreferences();
    this.loadTasks();
  }

  protected loadTasks(): void {
    this.loading.set(true);
    this.error.set(null);

    this.taskService
      .list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (tasks) => this.tasks.set(tasks),
        error: (error: unknown) =>
          this.error.set(
            this.getErrorMessage(error, 'Nao foi possivel carregar as tarefas. Verifique a API.'),
          ),
      });
  }

  protected openCreateForm(): void {
    this.error.set(null);
    this.editingTask.set(null);
    this.showForm.set(true);
  }

  protected openEditForm(task: Task): void {
    this.error.set(null);
    this.editingTask.set(task);
    this.showForm.set(true);
  }

  protected closeForm(): void {
    this.showForm.set(false);
    this.editingTask.set(null);
  }

  protected closeFormFromOverlay(): void {
    this.closeForm();
  }

  protected openDeleteModal(task: Task): void {
    this.taskToDelete.set(task);
  }

  protected closeDeleteModal(): void {
    this.taskToDelete.set(null);
    this.deleting.set(false);
  }

  protected saveTask(payload: { titulo: string; descricao: string; status: TaskStatus }): void {
    this.saveLoading.set(true);
    const taskBeingEdited = this.editingTask();

    const request$ = taskBeingEdited
      ? this.taskService.update(taskBeingEdited.id, payload as UpdateTaskPayload)
      : this.taskService.create(payload as CreateTaskPayload);

    request$.pipe(finalize(() => this.saveLoading.set(false))).subscribe({
      next: () => {
        this.closeForm();
        this.loadTasks();
      },
      error: (error: unknown) =>
        this.error.set(
          this.getErrorMessage(error, 'Nao foi possivel salvar a tarefa. Tente novamente.'),
        ),
    });
  }

  protected confirmDeleteTask(): void {
    const currentTask = this.taskToDelete();
    if (!currentTask || this.deleting()) {
      return;
    }

    this.deleting.set(true);
    this.taskService
      .delete(currentTask.id)
      .pipe(finalize(() => this.deleting.set(false)))
      .subscribe({
        next: () => {
          this.closeDeleteModal();
          this.loadTasks();
        },
        error: (error: unknown) =>
          this.error.set(
            this.getErrorMessage(error, 'Nao foi possivel excluir a tarefa. Tente novamente.'),
          ),
      });
  }

  protected onFilterChange(value: string): void {
    this.statusFilter.set(value as StatusFilter);
    this.page.set(1);
  }

  protected setSort(column: SortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set(column === 'dataCriacao' ? 'desc' : 'asc');
    }

    this.persistSortPreferences();
    this.page.set(1);
  }

  protected getAriaSort(column: SortColumn): 'ascending' | 'descending' | 'none' {
    if (this.sortColumn() !== column) {
      return 'none';
    }

    return this.sortDirection() === 'asc' ? 'ascending' : 'descending';
  }

  protected previousPage(): void {
    if (this.page() > 1) {
      this.page.set(this.page() - 1);
    }
  }

  protected nextPage(): void {
    if (this.page() < this.totalPages()) {
      this.page.set(this.page() + 1);
    }
  }

  protected formatStatus(status: TaskStatus): string {
    return status;
  }

  protected formatCreationDate(date?: string | Date): string {
    if (!date) {
      return '-';
    }

    const parsedDate = this.parseApiDate(date);
    if (!parsedDate) {
      return String(date);
    }

    try {
      return formatDate(parsedDate, 'dd/MM/yyyy', 'pt-BR');
    } catch {
      return String(parsedDate);
    }
  }

  private getDateSortValue(date?: string | Date): number {
    const parsedDate = this.parseApiDate(date);
    return parsedDate ? parsedDate.getTime() : 0;
  }

  private loadSortPreferences(): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    const rawValue = storage.getItem(this.sortStorageKey);
    if (!rawValue) {
      return;
    }

    try {
      const parsed = JSON.parse(rawValue) as { column?: unknown; direction?: unknown };
      if (this.isSortColumn(parsed.column) && this.isSortDirection(parsed.direction)) {
        this.sortColumn.set(parsed.column);
        this.sortDirection.set(parsed.direction);
      }
    } catch {
      storage.removeItem(this.sortStorageKey);
    }
  }

  private persistSortPreferences(): void {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    storage.setItem(
      this.sortStorageKey,
      JSON.stringify({
        column: this.sortColumn(),
        direction: this.sortDirection(),
      }),
    );
  }

  private getStorage(): Storage | null {
    try {
      return globalThis.localStorage;
    } catch {
      return null;
    }
  }

  private isSortColumn(value: unknown): value is SortColumn {
    return (
      value === 'titulo' || value === 'descricao' || value === 'status' || value === 'dataCriacao'
    );
  }

  private isSortDirection(value: unknown): value is SortDirection {
    return value === 'asc' || value === 'desc';
  }

  private parseApiDate(date?: string | Date): Date | null {
    if (!date) {
      return null;
    }

    if (date instanceof Date) {
      return Number.isNaN(date.getTime()) ? null : date;
    }

    const rawValue = date.trim();

    // Handles .NET payload format:
    // "2026-04-24T17:30:31.1829611"
    const dotNetMatch = rawValue.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|[+\-]\d{2}:\d{2})?$/,
    );
    if (dotNetMatch) {
      const [, year, month, day, hour, minute, second, fraction, timezone] = dotNetMatch;
      const milliseconds = Number((fraction ?? '').slice(0, 3).padEnd(3, '0'));

      if (timezone) {
        const isoWithMs = `${year}-${month}-${day}T${hour}:${minute}:${second}.${String(milliseconds).padStart(3, '0')}${timezone}`;
        const parsedWithTimezone = new Date(isoWithMs);
        return Number.isNaN(parsedWithTimezone.getTime()) ? null : parsedWithTimezone;
      }

      const parsedLocal = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second),
        milliseconds,
      );
      return Number.isNaN(parsedLocal.getTime()) ? null : parsedLocal;
    }

    // Handles strings like:
    // "Fri Apr 24 2026 17:39:35 GMT-0300 (Horário Padrão de Brasília)"
    const sanitized = rawValue.replace(/\s+\(.*\)\s*$/, '');
    const parsedSanitized = new Date(sanitized);
    if (!Number.isNaN(parsedSanitized.getTime())) {
      return parsedSanitized;
    }

    const withMillis = rawValue.replace(
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(\.\d+)?(Z|[+\-]\d{2}:\d{2})?$/,
      (_all, base: string, fraction?: string, timezone?: string) => {
        const milliseconds = (fraction ? fraction.slice(1, 4) : '').padEnd(3, '0');
        return `${base}.${milliseconds}${timezone ?? ''}`;
      },
    );

    const parsedDate = new Date(withMillis);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallback;
    }

    const responseError = error.error;
    if (typeof responseError === 'string' && responseError.trim().length > 0) {
      return responseError;
    }

    if (responseError && typeof responseError === 'object') {
      const message = (responseError as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim().length > 0) {
        return message;
      }

      const title = (responseError as { title?: unknown }).title;
      if (typeof title === 'string' && title.trim().length > 0) {
        return title;
      }

      const errors = (responseError as { errors?: Record<string, string[] | string> }).errors;
      if (errors && typeof errors === 'object') {
        const firstError = Object.values(errors)
          .flat()
          .find((item) => typeof item === 'string' && item.trim().length > 0);
        if (firstError) {
          return firstError;
        }
      }
    }

    return fallback;
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.taskToDelete()) {
      this.closeDeleteModal();
      return;
    }

    if (this.showForm()) {
      this.closeForm();
    }
  }
}
