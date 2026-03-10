import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskPriority } from './enums/task-priority.enum';
import { TaskStatus } from './enums/task-status.enum';

describe('TasksController', () => {
  let app: INestApplication;

  const taskId = '550e8400-e29b-41d4-a716-446655440000';

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  };

  const buildTask = (overrides: Partial<Record<string, unknown>> = {}) => ({
    id: taskId,
    title: 'Task 1',
    description: 'Desc 1',
    status: TaskStatus.PENDING,
    priority: TaskPriority.HIGH,
    ...overrides,
  });

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

  describe('POST /tasks', () => {
    it('returns 201 with the created task and delegates to the service', async () => {
      const payload = {
        title: 'Task 1',
        description: 'Desc 1',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
      };

      const createdTask = buildTask();
      mockTasksService.create.mockResolvedValue(createdTask);

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(payload)
        .expect(201);

      expect(response.body).toEqual(createdTask);
      expect(mockTasksService.create).toHaveBeenCalledWith(payload);
      expect(mockTasksService.create).toHaveBeenCalledTimes(1);
    });

    it('returns 400 when the payload contains unknown properties', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Task 1',
          description: 'Desc 1',
          status: TaskStatus.PENDING,
          priority: TaskPriority.HIGH,
          unexpectedField: true,
        })
        .expect(400);

      expect(mockTasksService.create).not.toHaveBeenCalled();
    });

    it('returns 400 when enum values are invalid', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Task 1',
          description: 'Desc 1',
          status: 'invalid-status',
          priority: 'urgent',
        })
        .expect(400);

      expect(mockTasksService.create).not.toHaveBeenCalled();
    });
  });

  describe('GET /tasks', () => {
    it('returns 200 with the tasks list and passes filters to the service', async () => {
      const tasks = [buildTask()];
      mockTasksService.findAll.mockResolvedValue(tasks);

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .query({
          status: TaskStatus.PENDING,
          priority: TaskPriority.HIGH,
        })
        .expect(200);

      expect(response.body).toEqual(tasks);
      expect(mockTasksService.findAll).toHaveBeenCalledWith({
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
      });
      expect(mockTasksService.findAll).toHaveBeenCalledTimes(1);
    });

    it('returns 400 when query params are invalid', async () => {
      await request(app.getHttpServer())
        .get('/tasks')
        .query({
          status: 'wrong',
          priority: 'wrong',
        })
        .expect(400);

      expect(mockTasksService.findAll).not.toHaveBeenCalled();
    });
  });

  describe('GET /tasks/:id', () => {
    it('returns 200 with the task', async () => {
      const task = buildTask();
      mockTasksService.findOne.mockResolvedValue(task);

      const response = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .expect(200);

      expect(response.body).toEqual(task);
      expect(mockTasksService.findOne).toHaveBeenCalledWith(taskId);
      expect(mockTasksService.findOne).toHaveBeenCalledTimes(1);
    });

    it('returns 400 for an invalid uuid', async () => {
      await request(app.getHttpServer()).get('/tasks/not-a-uuid').expect(400);

      expect(mockTasksService.findOne).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('returns 200 with the updated task and delegates to the service', async () => {
      const payload = {
        title: 'Updated task',
        description: 'Updated desc',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
      };

      const updatedTask = buildTask(payload);
      mockTasksService.update.mockResolvedValue(updatedTask);

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send(payload)
        .expect(200);

      expect(response.body).toEqual(updatedTask);
      expect(mockTasksService.update).toHaveBeenCalledWith(taskId, payload);
      expect(mockTasksService.update).toHaveBeenCalledTimes(1);
    });

    it('returns 400 when the update payload contains invalid values', async () => {
      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}`)
        .send({
          priority: 'urgent',
        })
        .expect(400);

      expect(mockTasksService.update).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /tasks/:id/status', () => {
    it('returns 200 with the updated status and delegates to the service', async () => {
      const updatedTask = buildTask({ status: TaskStatus.DONE });
      mockTasksService.updateStatus.mockResolvedValue(updatedTask);

      const response = await request(app.getHttpServer())
        .patch(`/tasks/${taskId}/status`)
        .send({
          status: TaskStatus.DONE,
        })
        .expect(200);

      expect(response.body).toEqual(updatedTask);
      expect(mockTasksService.updateStatus).toHaveBeenCalledWith(taskId, {
        status: TaskStatus.DONE,
      });
      expect(mockTasksService.updateStatus).toHaveBeenCalledTimes(1);
    });

    it('returns 400 when the status payload is invalid', async () => {
      await request(app.getHttpServer())
        .patch(`/tasks/${taskId}/status`)
        .send({
          status: 'blocked',
        })
        .expect(400);

      expect(mockTasksService.updateStatus).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('returns 204 and delegates to the service', async () => {
      mockTasksService.remove.mockResolvedValue(undefined);

      await request(app.getHttpServer()).delete(`/tasks/${taskId}`).expect(204);

      expect(mockTasksService.remove).toHaveBeenCalledWith(taskId);
      expect(mockTasksService.remove).toHaveBeenCalledTimes(1);
    });

    it('returns 400 for an invalid uuid', async () => {
      await request(app.getHttpServer())
        .delete('/tasks/not-a-uuid')
        .expect(400);

      expect(mockTasksService.remove).not.toHaveBeenCalled();
    });
  });
});
