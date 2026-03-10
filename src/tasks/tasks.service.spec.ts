import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { TaskPriority } from './enums/task-priority.enum';
import { TaskStatus } from './enums/task-status.enum';

describe('TasksService', () => {
  let service: TasksService;

  const taskId = '550e8400-e29b-41d4-a716-446655440000';

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  const buildTask = (overrides: Partial<Record<string, unknown>> = {}) => ({
    id: taskId,
    title: 'Task 1',
    description: 'Desc 1',
    status: TaskStatus.PENDING,
    priority: TaskPriority.HIGH,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  const createQueryFailedError = () =>
    new QueryFailedError('SELECT 1', [], new Error('db failed'));

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

  describe('create', () => {
    it('should create a task', async () => {
      const dto = {
        title: 'Task 1',
        description: 'Desc 1',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
      };

      const savedTask = buildTask();

      mockRepository.create.mockReturnValue(dto);
      mockRepository.save.mockResolvedValue(savedTask);

      const result = await service.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual(savedTask);
    });

    it('should translate repository query errors into InternalServerErrorException', async () => {
      const dto = {
        title: 'Task 1',
        description: 'Desc 1',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
      };

      mockRepository.create.mockReturnValue(dto);
      mockRepository.save.mockRejectedValue(createQueryFailedError());

      try {
        await service.create(dto);
        fail('Expected create to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect((error as InternalServerErrorException).message).toBe(
          'Database operation failed',
        );
      }
    });
  });

  describe('findAll', () => {
    it('should return filtered tasks', async () => {
      const tasks = [buildTask()];

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

    it('should return tasks without filters', async () => {
      const tasks = [
        buildTask(),
        buildTask({ id: '550e8400-e29b-41d4-a716-446655440001' }),
      ];
      mockRepository.find.mockResolvedValue(tasks);

      const result = await service.findAll({});

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {},
        order: {
          createdAt: 'DESC',
        },
      });
      expect(result).toEqual(tasks);
    });

    it('should apply partial filters', async () => {
      const tasks = [buildTask({ priority: TaskPriority.MEDIUM })];
      mockRepository.find.mockResolvedValue(tasks);

      const result = await service.findAll({
        priority: TaskPriority.MEDIUM,
      });

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          priority: TaskPriority.MEDIUM,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('should return one task by uuid', async () => {
      const task = buildTask({ priority: TaskPriority.MEDIUM });

      mockRepository.findOneBy.mockResolvedValue(task);

      const result = await service.findOne(taskId);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        id: taskId,
      });
      expect(result).toEqual(task);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      const missingTaskId = '550e8400-e29b-41d4-a716-446655449999';
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(missingTaskId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        id: missingTaskId,
      });
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const dto = {
        title: 'Updated task',
        priority: TaskPriority.MEDIUM,
      };
      const preloadedTask = buildTask(dto);
      const updatedTask = buildTask(dto);

      mockRepository.preload.mockResolvedValue(preloadedTask);
      mockRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update(taskId, dto);

      expect(mockRepository.preload).toHaveBeenCalledWith({
        id: taskId,
        ...dto,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(preloadedTask);
      expect(result).toEqual(updatedTask);
    });

    it('should throw NotFoundException when preload returns null', async () => {
      mockRepository.preload.mockResolvedValue(null);

      await expect(
        service.update(taskId, { title: 'Updated task' }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(mockRepository.preload).toHaveBeenCalledWith({
        id: taskId,
        title: 'Updated task',
      });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should translate repository query errors on update', async () => {
      const dto = { description: 'Updated desc' };
      const preloadedTask = buildTask(dto);

      mockRepository.preload.mockResolvedValue(preloadedTask);
      mockRepository.save.mockRejectedValue(createQueryFailedError());

      try {
        await service.update(taskId, dto);
        fail('Expected update to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect((error as InternalServerErrorException).message).toBe(
          'Database operation failed',
        );
      }
    });
  });

  describe('updateStatus', () => {
    it('should delegate to update with the new status', async () => {
      const updatedTask = buildTask({ status: TaskStatus.DONE });
      const updateSpy = jest
        .spyOn(service, 'update')
        .mockResolvedValue(updatedTask);

      const result = await service.updateStatus(taskId, {
        status: TaskStatus.DONE,
      });

      expect(updateSpy).toHaveBeenCalledWith(taskId, {
        status: TaskStatus.DONE,
      });
      expect(result).toEqual(updatedTask);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(taskId)).resolves.toBeUndefined();

      expect(mockRepository.delete).toHaveBeenCalledWith(taskId);
    });

    it('should throw NotFoundException when nothing is deleted', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(taskId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepository.delete).toHaveBeenCalledWith(taskId);
    });

    it('should translate repository query errors on delete', async () => {
      mockRepository.delete.mockRejectedValue(createQueryFailedError());

      try {
        await service.remove(taskId);
        fail('Expected remove to throw');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect((error as InternalServerErrorException).message).toBe(
          'Database operation failed',
        );
      }
    });
  });
});
