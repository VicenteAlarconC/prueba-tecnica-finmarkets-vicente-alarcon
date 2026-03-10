import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskStatus } from './enums/task-status.enum';
import { TaskPriority } from './enums/task-priority.enum';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all tasks', async () => {
    const tasks = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'Task 1',
        description: 'Desc 1',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
      },
    ];

    mockTasksService.findAll.mockResolvedValue(tasks);

    const result = await controller.findAll({
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    });

    expect(mockTasksService.findAll).toHaveBeenCalledWith({
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    });
    expect(result).toEqual(tasks);
  });

  it('should return one task by id', async () => {
    const task = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'Task 2',
      description: 'Desc 2',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
    };

    mockTasksService.findOne.mockResolvedValue(task);

    const result = await controller.findOne(
      '550e8400-e29b-41d4-a716-446655440001',
    );

    expect(mockTasksService.findOne).toHaveBeenCalledWith(
      '550e8400-e29b-41d4-a716-446655440001',
    );
    expect(result).toEqual(task);
  });
});
