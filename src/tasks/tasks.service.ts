import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}
  create(createTaskDto: CreateTaskDto) {
    return 'This action adds a new task';
  }

  async findAll(filters: QueryTaskDto): Promise<Task[]> {
    const where: FindOptionsWhere<Task> = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    return this.tasksRepository.find({
      where,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
