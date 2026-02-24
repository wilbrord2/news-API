import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReadlogService } from './readlog.service';
import { CreateReadlogDto } from './dto/create-readlog.dto';
import { UpdateReadlogDto } from './dto/update-readlog.dto';

@Controller('readlog')
export class ReadlogController {
  constructor(private readonly readlogService: ReadlogService) {}

  @Post()
  create(@Body() createReadlogDto: CreateReadlogDto) {
    return this.readlogService.create(createReadlogDto);
  }

  @Get()
  findAll() {
    return this.readlogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.readlogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReadlogDto: UpdateReadlogDto) {
    return this.readlogService.update(+id, updateReadlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.readlogService.remove(+id);
  }
}
