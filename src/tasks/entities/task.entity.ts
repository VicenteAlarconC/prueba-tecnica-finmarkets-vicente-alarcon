import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';

@Entity('Tasks')
@Index(['status'])
@Index(['priority'])
export class Task {
  @ApiProperty({
    description: 'Identificador unico de la tarea.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Titulo corto de la tarea.',
    example: 'Preparar informe mensual',
  })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({
    description: 'Descripcion completa de la tarea.',
    example: 'Consolidar ventas, costos y margenes del ultimo mes.',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'Estado actual de la tarea.',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'Prioridad asignada a la tarea.',
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
  })
  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @ApiProperty({
    description: 'Fecha de creacion del registro.',
    example: '2026-03-10T12:00:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de la ultima actualizacion del registro.',
    example: '2026-03-10T13:30:00.000Z',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
