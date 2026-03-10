import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { TaskPriority } from './enums/task-priority.enum';
import { TaskStatus } from './enums/task-status.enum';

describe('TasksService', () => {
  let service: TasksService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should create a task', async () => {
    const dto = {
      title: 'Task 1',
      description: 'Desc 1',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    };

    const savedTask = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      ...dto,
    };

    mockRepository.create.mockReturnValue(dto);
    mockRepository.save.mockResolvedValue(savedTask);

    const result = await service.create(dto);

    expect(mockRepository.create).toHaveBeenCalledWith(dto);
    expect(mockRepository.save).toHaveBeenCalledWith(dto);
    expect(result).toEqual(savedTask);
  });

  it('should return filtered tasks', async () => {
    const tasks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Task 1',
        description: 'Desc',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
      },
    ];

    mockRepository.find.mockResolvedValue(tasks);

    const result = await service.findAll({
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    });

    expect(mockRepository.find).toHaveBeenCalledWith({
      where: {
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    expect(result).toEqual(tasks);
  });

  it('should return one task by uuid', async () => {
    const task = {
      id: '550e8400-e29b-41d4-a716-446655440002',
      title: 'Task 1',
      description: 'Desc',
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
    };

    mockRepository.findOneBy.mockResolvedValue(task);

    const result = await service.findOne(
      '550e8400-e29b-41d4-a716-446655440002',
    );

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      id: '550e8400-e29b-41d4-a716-446655440002',
    });
    expect(result).toEqual(task);
  });

  it('should throw NotFoundException when task does not exist', async () => {
    mockRepository.findOneBy.mockResolvedValue(null);

    await expect(
      service.findOne('550e8400-e29b-41d4-a716-446655449999'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
