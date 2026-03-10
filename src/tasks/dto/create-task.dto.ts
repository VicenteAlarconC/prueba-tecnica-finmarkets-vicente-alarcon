import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Titulo de la tarea.',
    example: 'Comprar viveres',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiProperty({
    description: 'Descripcion detallada de la tarea.',
    example: 'Comprar leche, huevos y pan en el supermercado',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Estado inicial de la tarea.',
    example: 'pending',
    enum: TaskStatus,
  })
  @IsEnum(TaskStatus, {
    message: 'status debe ser uno de los siguientes valores: pending, in_progress, done',
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'Nivel de prioridad de la tarea.',
    example: 'medium',
    enum: TaskPriority,
  })
  @IsEnum(TaskPriority, {
    message: 'priority debe ser uno de los siguientes valores: low, medium, high',
  })
  priority: TaskPriority;
}
