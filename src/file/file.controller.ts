import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
  UseGuards,
  Req
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from 'src/common/gaurds/accessToken.guard';
import { Request } from 'express';

import { diskStorage } from 'multer';
import * as path from 'path';

export const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const extension = path.extname(file.originalname);
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    cb(null, `${randomName}${extension}`);
  },
});



@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @UseGuards(AccessTokenGuard)
  @Post("upload")
  @UseInterceptors(FileInterceptor('file', { storage }))
  create(@UploadedFile(
    new ParseFilePipeBuilder()
      .addMaxSizeValidator({ maxSize: 1024 * 1024 * 4 })
      .addFileTypeValidator({ fileType: process.env.ACCEPT_MIME_TYPE })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),
  ) file: Express.Multer.File, @Req() req: Request) {
    return this.fileService.create(file, req.user['sub']);
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
