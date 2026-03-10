import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

import { Task } from '../tasks/entities/task.entity';
import { TaskPriority } from '../tasks/enums/task-priority.enum';
import { TaskStatus } from '../tasks/enums/task-status.enum';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async populateDB() {
    faker.seed(123);

    const statuses: TaskStatus[] = [
      TaskStatus.PENDING,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];

    const priorities: TaskPriority[] = [
      TaskPriority.LOW,
      TaskPriority.MEDIUM,
      TaskPriority.HIGH,
    ];

    await this.tasksRepository.clear();

    const tasks = Array.from({ length: 10 }, (_, index) =>
      this.tasksRepository.create({
        title: `Task ${index + 1} - ${faker.lorem.words(3)}`,
        description: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(statuses),
        priority: faker.helpers.arrayElement(priorities),
      }),
    );

    const insertedTasks = await this.tasksRepository.save(tasks);

    return {
      message: 'Base de datos poblada correctamente',
      count: insertedTasks.length,
      data: insertedTasks,
    };
  }
}
