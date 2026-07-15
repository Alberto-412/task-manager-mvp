import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type TaskStatus = 'pending' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskInput {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  due_date?: string | null;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/tasks';

  getTasks(status?: TaskStatus | 'all'): Observable<Task[]> {
    const params = status && status !== 'all' ? new HttpParams().set('status', status) : undefined;
    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  createTask(data: TaskInput): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, data);
  }

  updateTask(id: number, data: TaskInput): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, data);
  }

  updateStatus(id: number, status: TaskStatus): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/status`, { status });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
