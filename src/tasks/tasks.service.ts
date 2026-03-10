import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueryFailedError } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  // Construye y persiste una nueva tarea en la base de datos.
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const task = this.tasksRepository.create(createTaskDto);
      return await this.tasksRepository.save(task);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  // Obtiene tareas aplicando filtros opcionales por estado y prioridad.
  async findAll(filters: QueryTaskDto): Promise<Task[]> {
    const { page = 1, offset = 10, status, priority } = filters;
    const where: FindOptionsWhere<Task> = {};

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    return this.tasksRepository.find({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * offset,
      take: offset,
    });
  }

  // Busca una tarea por ID y lanza error si no existe.
  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  // Precarga los cambios sobre una tarea existente y los guarda.
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.tasksRepository.preload({
      id,
      ...updateTaskDto,
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    try {
      return await this.tasksRepository.save(task);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  // Reutiliza la actualizacion general para modificar solo el estado.
  async updateStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    return this.update(id, { status: updateTaskStatusDto.status });
  }

  // Elimina una tarea y valida que realmente exista antes de confirmar el borrado.
  async remove(id: string): Promise<void> {
    try {
      const result = await this.tasksRepository.delete(id);

      if (!result.affected) {
        throw new NotFoundException(`Task with id ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleDbError(error);
    }
  }

  // Traduce errores de infraestructura a excepciones HTTP controladas.
  private handleDbError(error: unknown): never {
    if (error instanceof QueryFailedError) {
      throw new InternalServerErrorException('Database operation failed');
    }

    throw new InternalServerErrorException('Unexpected server error');
  }
}
