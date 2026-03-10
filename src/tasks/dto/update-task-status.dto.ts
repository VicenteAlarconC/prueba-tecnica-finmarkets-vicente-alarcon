import { IsEnum } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskStatusDto {
  @ApiProperty({
    description: 'Nuevo estado que se asignara a la tarea.',
    example: 'in_progress',
    enum: TaskStatus,
  })
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
