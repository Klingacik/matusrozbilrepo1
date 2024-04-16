import { Injectable, Inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { TaskDetailDTO } from '../taskdetail/TaskDetailDTO';


@Injectable({
  providedIn: 'root'
})

export class TaskService {
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private route: ActivatedRoute) { }
  createTask(Task: CreateTaskDTO) {
    return this.http.put<CreateTaskDTO>(this.baseUrl + '/tasklist', Task);
  };
  getTaskDetails(id: number){
    return this.http.get<TaskDetailDTO>(this.baseUrl + "/taskdetail/" + id);
  }
  
}


export interface CreateTaskDTO {
  taskName: string;
  taskDescription: string;
  taskPriority: number;
  taskDeadline: Date; 
}

