import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './entities/file.entity';
@Module({
  imports :[
    UserModule,
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    MulterModule.register({
      dest :'./uploads'
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
