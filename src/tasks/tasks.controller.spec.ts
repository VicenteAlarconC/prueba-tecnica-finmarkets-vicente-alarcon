import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskPriority } from './enums/task-priority.enum';
import { TaskStatus } from './enums/task-status.enum';

describe('TasksController', () => {
  let app: INestApplication;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  };

  const taskId = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /tasks should return 201', async () => {
    const payload = {
      title: 'Task 1',
      description: 'Desc 1',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    };

    mockTasksService.create.mockResolvedValue({
      id: taskId,
      ...payload,
    });

    await request(app.getHttpServer()).post('/tasks').send(payload).expect(201);
  });

  it('GET /tasks should return 200', async () => {
    mockTasksService.findAll.mockResolvedValue([]);

    await request(app.getHttpServer()).get('/tasks').expect(200);
  });

  it('GET /tasks/:id should return 200', async () => {
    mockTasksService.findOne.mockResolvedValue({
      id: taskId,
      title: 'Task 1',
      description: 'Desc 1',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
    });

    await request(app.getHttpServer()).get(`/tasks/${taskId}`).expect(200);
  });

  it('PATCH /tasks/:id should return 200', async () => {
    mockTasksService.update.mockResolvedValue({
      id: taskId,
      title: 'Updated task',
      description: 'Updated desc',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
    });

    await request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .send({
        title: 'Updated task',
        description: 'Updated desc',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
      })
      .expect(200);
  });

  it('PATCH /tasks/:id/status should return 200', async () => {
    mockTasksService.updateStatus.mockResolvedValue({
      id: taskId,
      title: 'Task 1',
      description: 'Desc 1',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
    });

    await request(app.getHttpServer())
      .patch(`/tasks/${taskId}/status`)
      .send({
        status: TaskStatus.DONE,
      })
      .expect(200);
  });

  it('DELETE /tasks/:id should return 204', async () => {
    mockTasksService.remove.mockResolvedValue(undefined);

    await request(app.getHttpServer()).delete(`/tasks/${taskId}`).expect(204);
  });

  it('GET /tasks/:id should return 400 for invalid uuid', async () => {
    await request(app.getHttpServer()).get('/tasks/not-a-uuid').expect(400);
  });
});
