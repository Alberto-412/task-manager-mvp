import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Task, TaskInput, TaskPriority, TaskService, TaskStatus } from '../../services/task.service';

type StatusFilter = TaskStatus | 'all';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  currentUser = this.authService.currentUser;

  tasks = signal<Task[]>([]);
  statusFilter = signal<StatusFilter>('all');
  editingTaskId = signal<number | null>(null);
  errorMessage = signal<string | null>(null);

  filteredTasks = computed(() => {
    const filter = this.statusFilter();
    const tasks = this.tasks();
    return filter === 'all' ? tasks : tasks.filter((task) => task.status === filter);
  });

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: [''],
    priority: ['medium' as TaskPriority, [Validators.required]],
    due_date: [''],
  });

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => this.tasks.set(tasks),
      error: () => this.errorMessage.set('No se pudieron cargar las tareas'),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: TaskInput = {
      title: raw.title,
      description: raw.description || null,
      priority: raw.priority,
      due_date: raw.due_date || null,
    };

    const editingId = this.editingTaskId();
    const request = editingId
      ? this.taskService.updateTask(editingId, payload)
      : this.taskService.createTask(payload);

    request.subscribe({
      next: () => {
        this.resetForm();
        this.loadTasks();
      },
      error: () => this.errorMessage.set('No se pudo guardar la tarea'),
    });
  }

  onEdit(task: Task): void {
    this.editingTaskId.set(task.id);
    this.form.setValue({
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      due_date: task.due_date ? task.due_date.substring(0, 10) : '',
    });
  }

  onCancelEdit(): void {
    this.resetForm();
  }

  onDelete(id: number): void {
    if (!confirm('¿Seguro que quieres borrar esta tarea?')) {
      return;
    }

    this.taskService.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
      error: () => this.errorMessage.set('No se pudo borrar la tarea'),
    });
  }

  onStatusChange(task: Task, status: TaskStatus): void {
    this.taskService.updateStatus(task.id, status).subscribe({
      next: () => this.loadTasks(),
      error: () => this.errorMessage.set('No se pudo actualizar el estado'),
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatDueDate(dueDate: string): string {
    const [year, month, day] = dueDate.substring(0, 10).split('-');
    return `${day}/${month}/${year}`;
  }

  private resetForm(): void {
    this.editingTaskId.set(null);
    this.form.reset({ title: '', description: '', priority: 'medium', due_date: '' });
  }
}
