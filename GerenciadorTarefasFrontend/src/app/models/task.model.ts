export type TaskStatus = 'Pendente' | 'Concluída';

export interface Task {
  id: number;
  titulo: string;
  descricao?: string;
  status: TaskStatus;
  dataCriacao?: string | Date;
}

export interface CreateTaskPayload {
  titulo: string;
  descricao?: string;
  status: TaskStatus;
}

export type UpdateTaskPayload = CreateTaskPayload;
