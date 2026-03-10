import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Title of the task',
    example: 'Buy groceries',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiProperty({
    description: 'Description of the task',
    example: 'Buy milk, eggs, and bread from the supermarket',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Status of the task',
    example: 'pending',
    enum: TaskStatus,
  })
  @IsEnum(TaskStatus, {
    message: 'status must be one of: pending, in_progress, done',
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'Priority of the task',
    example: 'medium',
    enum: TaskPriority,
  })
  @IsEnum(TaskPriority, {
    message: 'priority must be one of: low, medium, high',
  })
  priority: TaskPriority;
}
