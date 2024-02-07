import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AccessTokenGuard } from 'src/common/gaurds/accessToken.guard';
import { Request } from 'express';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) { }

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @Req() req: Request) {
    return this.notesService.create(createNoteDto, req.user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.notesService.findAll(req.user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.notesService.findOne(id, req.user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id',)
  update(@Param('id',) id: string, @Body() updateNoteDto: UpdateNoteDto, @Req() req: Request) {
    return this.notesService.update(id, updateNoteDto, req.user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.notesService.remove(id, req.user['sub']);
  }
}
