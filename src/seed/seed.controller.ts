import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiOkResponse({
    description: 'Database populated successfully',
  })
  @Get()
  populateDB() {
    return this.seedService.populateDB();
  }
}
