import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { UserService } from '../user/user.service';
import { Note, NoteDocument } from './entities/note.entity';
import { promises } from 'dns';
const ObjectId = require('mongodb').ObjectId;


@Injectable()
export class NotesService {
  constructor(
    private userService: UserService,
    @InjectModel(Note.name) private noteModule: Model<NoteDocument>
  ) { }
  async create(createNoteDto: CreateNoteDto, userId: string): Promise<any> {
    const { title, content } = createNoteDto;
    const user = await this.userService.findById(userId)
    const notes = new this.noteModule({ ...createNoteDto, user });
    const response = notes.save()
    return "Success"
  }

  async findAll(userId: string): Promise<NoteDocument[]> {

    return this.noteModule.find({ user: userId }).exec()
  }

  async findOne(id: String, userId: string): Promise<NoteDocument> {
    const note = await this.noteModule.findOne({ _id: id, user: userId }).exec();
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note
  }

  async update(id: String, updateNoteDto: UpdateNoteDto, userId: string): Promise<any> {
    const updatedNote = await this.noteModule
      .findOneAndUpdate({ _id: id, user: userId }, updateNoteDto, { new: true })
      .exec();
    if (!updatedNote) {
      throw new NotFoundException('Note not found');
    }
    return "success"
  }

  async remove(id: String, userId: string): Promise<any> {
    const deletedNote = await this.noteModule
      .findByIdAndDelete({ _id: id, user: userId })
      .exec();

    if (!deletedNote) {
      throw new NotFoundException('Note not found');
    }
    return "success"
  }
}
