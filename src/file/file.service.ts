import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { File, FileDocument } from './entities/file.entity';
import { CommonResponseDto, SuccessResponseDto } from 'src/common/dto/common-response.dto';
@Injectable()
export class FileService {

  constructor(
    private userService: UserService,
    @InjectModel(File.name) private fileModel: Model<FileDocument>
  ) { }
  async create(file: Express.Multer.File, userId: string): Promise<CommonResponseDto> {
    try {
      const user = await this.userService.findById(userId);
      const uploadedFile = new this.fileModel({
        fileName: file.filename,
        originalName: file.originalname,
        path: file.path,
        mimeType: file.mimetype,
        user
      });
      await uploadedFile.save()

      const responseData = {
        fileName: uploadedFile.fileName,
        originalName: uploadedFile.originalName,
        mimeType: uploadedFile.mimeType,
        id: uploadedFile._id
      };
      return new SuccessResponseDto(responseData);
    } catch (error) {
      throw new Error("Failed to create note");
    }

  }

  async findAll(userId: string): Promise<CommonResponseDto> {
    const files = await this.fileModel.find({ user: userId }).exec()
    const response = files.map(file => {
      const { user, path, ...fileWithoutUser } = file.toObject();

      return fileWithoutUser;
    });
    
    return new SuccessResponseDto(response)
  }

  async remove(id: string, userId: string) {
    try {
      const deletedFile = await this.fileModel
        .findByIdAndDelete({ _id: id, user: userId })
        .exec();
      return new SuccessResponseDto();
    } catch {
      throw new NotFoundException('Note not found');
    }
  }
}
