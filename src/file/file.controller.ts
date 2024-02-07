import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/common/gaurds/accessToken.guard';
import { Request } from 'express';
import { storage } from './file.utils';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(AccessTokenGuard)
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', undefined, { storage }))
  uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: Request,
  ) {
    return this.fileService.saveFiles(files, req.user['sub']);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.fileService.findAll(req.user['sub']);
  }
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.fileService.remove(id, req.user['sub']);
  }
}
