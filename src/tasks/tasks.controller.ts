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
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Tareas')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Crea una nueva tarea a partir de los datos enviados en el body.
  @ApiOperation({ summary: 'Crear una tarea' })
  @ApiCreatedResponse({
    description: 'La tarea fue creada correctamente.',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen con las validaciones.',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  // Obtiene el listado de tareas y permite filtrar por estado o prioridad.
  @ApiOperation({ summary: 'Listar tareas' })
  @ApiOkResponse({
    description: 'Las tareas fueron obtenidas correctamente.',
    type: Task,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Los parametros de busqueda no son validos.',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: QueryTaskDto): Promise<Task[]> {
    return this.tasksService.findAll(query);
  }

  // Busca una tarea por su identificador UUID.
  @ApiOperation({ summary: 'Obtener una tarea por ID' })
  @ApiOkResponse({
    description: 'La tarea fue obtenida correctamente.',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'El ID de la tarea no es un UUID valido.',
  })
  @ApiNotFoundResponse({
    description: 'No existe una tarea con el ID indicado.',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  // Actualiza los campos editables de una tarea existente.
  @ApiOperation({ summary: 'Actualizar una tarea' })
  @ApiOkResponse({
    description: 'La tarea fue actualizada correctamente.',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'El ID o los datos enviados no son validos.',
  })
  @ApiNotFoundResponse({
    description: 'No existe una tarea con el ID indicado.',
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto);
  }

  // Actualiza solo el estado de una tarea.
  @ApiOperation({ summary: 'Actualizar el estado de una tarea' })
  @ApiOkResponse({
    description: 'El estado de la tarea fue actualizado correctamente.',
    type: Task,
  })
  @ApiBadRequestResponse({
    description: 'El ID o el estado enviado no son validos.',
  })
  @ApiNotFoundResponse({
    description: 'No existe una tarea con el ID indicado.',
  })
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    return this.tasksService.updateStatus(id, updateTaskStatusDto);
  }

  // Elimina una tarea por su identificador.
  @ApiOperation({ summary: 'Eliminar una tarea' })
  @ApiNoContentResponse({
    description: 'La tarea fue eliminada correctamente.',
  })
  @ApiBadRequestResponse({
    description: 'El ID de la tarea no es un UUID valido.',
  })
  @ApiNotFoundResponse({
    description: 'No existe una tarea con el ID indicado.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.tasksService.remove(id);
  }
}
