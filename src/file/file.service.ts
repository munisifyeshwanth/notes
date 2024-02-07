import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { File, FileDocument } from './entities/file.entity';
import {
  CommonResponseDto,
  SuccessResponseDto,
} from 'src/common/dto/common-response.dto';
@Injectable()
export class FileService {
  constructor(
    private userService: UserService,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
  ) {}
  /*async saveFile(
    file: Express.Multer.File,
    userId: string,
  ): Promise<CommonResponseDto> {
    try {
      const user = await this.userService.findById(userId);
      const fileDocument = new this.fileModel({
        fileName: file.filename,
        originalName: file.originalname,
        path: file.path,
        mimeType: file.mimetype,
        user,
      });
      const result = await fileDocument.save();
      console.log(result)
      const responseData = {
        fileName: result.fileName,
        originalName: result.originalName,
        mimeType: result.mimeType,
        id: result._id,
      };
      console.log(responseData)
      return new SuccessResponseDto(responseData);
    } catch (error) {
      throw new Error('Failed to upload file');
    }
  }*/

  async saveFiles(
    files: Array<Express.Multer.File>,
    userId: string,
  ): Promise<CommonResponseDto> {
    console.log(files);

    try {
      const user = await this.userService.findById(userId);
      const fileDocuments = files.map((file) => ({
        fileName: file.filename,
        originalName: file.originalname,
        path: file.path,
        mimeType: file.mimetype,
        user,
      }));
      const result = await this.fileModel.insertMany(fileDocuments);
      const responseData = result.map((fileDocument) => ({
        fileName: fileDocument.fileName,
        originalName: fileDocument.originalName,
        mimeType: fileDocument.mimeType,
        id: fileDocument._id,
      }));
      return new SuccessResponseDto(responseData);
    } catch (error) {
      throw new Error('Failed to upload files');
    }
  }

  async findAll(userId: string): Promise<CommonResponseDto> {
    const files = await this.fileModel.find({ user: userId }).exec();
    const response = files.map((file) => {
      const { ...fileWithoutUser } = file.toObject();
      return fileWithoutUser;
    });
    return new SuccessResponseDto(response);
  }

  async remove(id: string, userId: string): Promise<CommonResponseDto> {
    try {
      await this.fileModel.findByIdAndDelete({ _id: id, user: userId }).exec();
      return new SuccessResponseDto();
    } catch {
      throw new NotFoundException('File not found');
    }
  }
}
