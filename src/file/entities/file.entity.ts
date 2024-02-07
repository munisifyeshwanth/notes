import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/entities/user.entity';

export type FileDocument = File & Document;

@Schema()
export class File {
    @Prop({ required: true })
    originalName: string;

    @Prop({ required: true })
    fileName: string;

    @Prop({ required: true })
    path: string;

    @Prop({ required: true })
    mimeType: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User
}

export const FileSchema = SchemaFactory.createForClass(File);
FileSchema.set('timestamps',true)

