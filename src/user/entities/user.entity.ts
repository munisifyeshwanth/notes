import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;

  @Prop()
  imagePath:string
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('timestamps',true)


