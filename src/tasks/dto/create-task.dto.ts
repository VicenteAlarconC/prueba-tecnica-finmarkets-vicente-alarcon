import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus, {
    message: 'status must be one of: pending, in_progress, done',
  })
  status: TaskStatus;

  @IsEnum(TaskPriority, {
    message: 'priority must be one of: low, medium, high',
  })
  priority: TaskPriority;
}
