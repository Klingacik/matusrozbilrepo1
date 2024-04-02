import { DATE_PIPE_DEFAULT_TIMEZONE, DatePipe, NgFor, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, signal, Injectable } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators, FormBuilder } from '@angular/forms';
import { TaskService, CreateTaskDTO } from './task.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';


@Component({
  selector: 'app-tasklist',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, DatePipe],
  templateUrl: './tasklist.component.html',
  styleUrl: './tasklist.component.css',

})
export class TasklistComponent {

  constructor(
    private route: ActivatedRoute, http: HttpClient,
    private router: Router,
    private taskService: TaskService,
    @Inject("BASE_URL") baseUrl: string) {
    http.get<TasksDTO[]>(baseUrl + '/tasks').subscribe(result => { this.TaskData = result; }, error => console.error(error));
  }

  taskName: string = "no data";
  taskDescription: string = "no data";
  taskPriority: number = 0;
  taskDeadline: Date ;

  taskForm = new FormGroup(
    {
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      priority: new FormControl(null, Validators.required),
      deadline: new FormControl(null, Validators.required),
    })



  public TaskData: TasksDTO[] = [];
  // newTask = signal<TasksDTO>(undefined);
  taskINFO = signal<CreateTaskDTO>(undefined);
  onAddTask() {
    if (this.taskForm.valid) {
      this.taskService.createTask({
        taskName: this.taskForm.controls['name'].value,
        taskDescription: this.taskForm.controls['description'].value,
        taskPriority: this.taskForm.controls['priority'].value,
        taskDeadline: this.taskForm.controls['deadline'].value,
      }).subscribe(TaskINFO => this.taskINFO.set(TaskINFO));
    }
  }

}

export interface TasksDTO {
  id: number;
  name: string;
  description: string;
  priority: number;
  isDone: boolean;
  deadline: Date;
}
