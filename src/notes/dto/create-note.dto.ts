import { IsNotEmpty } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty({ message: 'Please Enter title' })
  title: string;
  @IsNotEmpty({ message: 'Please Enter content ' })
  content: string;
}
