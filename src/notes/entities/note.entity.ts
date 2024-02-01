import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/entities/user.entity';


export type NoteDocument = Note & Document;

@Schema()
export class Note {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true})
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User
}
export const NoteSchema = SchemaFactory.createForClass(Note);
NoteSchema.set('timestamps',true)
