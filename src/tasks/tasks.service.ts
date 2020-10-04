import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { copyFile } from 'fs';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find(task => task.id === id);
  }

  deleteTask(id: string): void{
    const filtTasks: Task[]= this.tasks.filter(task => task.id !== id)
    this.tasks= [...filtTasks]
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const {title, description}= createTaskDto
    const task: Task = {
      id: uuid.v4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }
  
  updateStatus(id: string, status: TaskStatus): Task {
    const taskToChange= this.getTaskById(id)
    taskToChange.status= status;
    return taskToChange;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, searchTerm }=filterDto;
    let tasks=this.getAllTasks();
    if(status) {
      tasks=this.tasks.filter(task => task.status === status)
    };
    if(searchTerm) {
      tasks=this.tasks.filter(task => task.title.includes(searchTerm) || task.description.includes(searchTerm));
    };
    return tasks;
  }
}
