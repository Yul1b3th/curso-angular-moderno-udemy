import { JsonPipe } from '@angular/common';
import { Component, effect, signal } from '@angular/core';

interface Task {
  id: string;
  name: string;
  complete: boolean;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <button class="btn btn-primary" (click)="addTask()">Agregar Tarea</button>
    <ul>
      @for (task of tasks(); track task.id) {
      <pre><li>{{ task | json }}</li></pre>
      }
    </ul>
  `,
})
export class TaskListComponent {
  tasks = signal<Task[]>([], { equal: this._compararArrays });

  constructor() {
    effect(() => {
      console.log('tasks', this.tasks());
    });
  }

  addTask(): void {
    const task = this.generateTask();
    this.tasks.update((tasks) => [...tasks, task]);
  }

  generateTask(): Task {
    const newId = this._generateRandomId();
    return {
      id: newId,
      name: `Tarea ${newId}`,
      complete: false,
    };
  }

  private _generateRandomId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private _compararArrays<T>(arr1: T[], arr2: T[]): boolean {
    if (!arr1 || !arr2) {
      return arr1 === arr2;
    }
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every((item, index) => item === arr2[index]);
  }
}
