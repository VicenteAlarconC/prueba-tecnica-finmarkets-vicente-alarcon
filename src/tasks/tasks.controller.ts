import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiAcceptedResponse({ description: 'Task created successfully', type: Task })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @ApiOkResponse({
    description: 'Tasks retrieved successfully',
    type: Task,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: QueryTaskDto): Promise<Task[]> {
    return this.tasksService.findAll(query);
  }

  @ApiOkResponse({
    description: 'Task retrieved successfully',
    type: Task,
  })
  @ApiBadRequestResponse({ description: 'Invalid task ID' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @ApiOkResponse({
    description: 'Task updated successfully',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'Invalid task ID or input data',
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @ApiOkResponse({
    description: 'Task status updated successfully',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'Invalid task ID or input data',
  })
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    return this.tasksService.updateStatus(id, updateTaskStatusDto);
  }

  @ApiNoContentResponse({ description: 'Task deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid task ID' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.tasksService.remove(id);
  }
}
