import { DatePipe, NgFor, NgIf, CommonModule} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, signal, AfterViewInit, DestroyRef, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { TaskService } from './task.service';
import { RouterLink } from '@angular/router';
import { TaskDetailDTO } from '../taskdetail/TaskDetailDTO';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SearchFilterPipe } from 'src/app/tasklist/search-filter.pipe';
import { TasksDTO } from './task';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tasklist',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, DatePipe, NgIf, CommonModule, RouterLink, SearchFilterPipe, MatTableModule, MatSortModule, FormsModule],
  templateUrl: './tasklist.component.html',
  styleUrl: './tasklist.component.css',
  providers : [SearchFilterPipe],
  styles: []
})
export class TasklistComponent implements AfterViewInit {
  destroyRef = inject(DestroyRef);
  searchTerm: string;
  taskData = signal<TasksDTO[]>([]);
  xd: boolean = false;
  taskForm = new FormGroup(
    {
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      priority: new FormControl(null, Validators.required),
      deadline: new FormControl(null, Validators.required),
    })

  constructor(
    http: HttpClient,
    private taskService: TaskService,

    @Inject("BASE_URL") baseUrl: string) {
    http.get<TasksDTO[]>(baseUrl + '/tasks').subscribe(result => { this.taskData.set(result) }, error => console.error(error));
  }
  deletni = signal<TaskDetailDTO>(undefined);

 ngAfterViewInit() {
   /* this.TaskData.sort(function (a, b) {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });

        this.TaskData.sort(function (a, b) {
      if (a.priority < b.priority) { return -1; }
      if (a.priority > b.priority) { return 1; }
      return 0;
    });

    this.TaskData.sort(function (a, b) {
      if (a.id < b.id) { return -1; }
      if (a.id > b.id) { return 1; }
      return 0;
    });*/

  }

  onAddTask() {
    if (this.taskForm.valid) {
      this.taskService.createTask({
        taskName: this.taskForm.controls['name'].value,
        taskDescription: this.taskForm.controls['description'].value,
        taskPriority: this.taskForm.controls['priority'].value,
        taskDeadline: this.taskForm.controls['deadline'].value,
      }).pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(taskInfo => this.taskData.update(tasks => [...tasks, taskInfo]));
    }
  }

  onDelete(id: number) {
    this.taskService.deleteTask(id).subscribe();
  }

  tglbtn() {
    var elem = document.getElementById("tglbttn");
    if (elem.innerHTML=="Show finished tasks")
    {
      elem.innerHTML = "Show unfinished tasks";
      this.xd = true;
    }

    else
    {
      elem.innerHTML = "Show finished tasks";
      this.xd = false;
    }
  }
}

