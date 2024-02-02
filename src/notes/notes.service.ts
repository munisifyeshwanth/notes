import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { UserService } from '../user/user.service';
import { Note, NoteDocument } from './entities/note.entity';
import { CommonResponseDto, SuccessResponseDto } from '../common/dto/common-response.dto';


@Injectable()
export class NotesService {
  constructor(
    private userService: UserService,
    @InjectModel(Note.name) private noteModule: Model<NoteDocument>
  ) { }
  async create(createNoteDto: CreateNoteDto, userId: string): Promise<CommonResponseDto> {
    try {
      const user = await this.userService.findById(userId);
      const notes = new this.noteModule({ ...createNoteDto, user });
      await notes.save();
      return new SuccessResponseDto();
    } catch (error) {
      throw new Error("Failed to create note");
    }
  }

  async findAll(userId: string): Promise<CommonResponseDto> {
    const notes = await this.noteModule.find({ user: userId }).exec()
    return new SuccessResponseDto("Success", notes)
  }

  async findOne(id: String, userId: string) {
    this.noteModule.findOne({ _id: id, user: userId })
    .exec()
    .then(note => {
        if (!note) {
            throw new NotFoundException("Note not found");
        }
        return new SuccessResponseDto(note);
    })
    .catch(error => {
        throw new NotFoundException("Note not found");
    });
  }

  async update(id: String, updateNoteDto: UpdateNoteDto, userId: string): Promise<CommonResponseDto> {
    try {
      const updatedNote = await this.noteModule
        .findOneAndUpdate({ _id: id, user: userId }, updateNoteDto, { new: true })
        .exec();
      return new SuccessResponseDto();
    } catch {
      throw new NotFoundException('Note not found');
    }

  }

  async remove(id: String, userId: string): Promise<CommonResponseDto> {
    try {
      const deletedNote = await this.noteModule
        .findByIdAndDelete({ _id: id, user: userId })
        .exec();
      return new SuccessResponseDto();
    } catch {
      throw new NotFoundException('Note not found');
    }
  }
}
