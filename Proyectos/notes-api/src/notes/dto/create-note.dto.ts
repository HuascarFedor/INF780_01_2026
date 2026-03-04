import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  @IsString({ message: 'El título debe ser un texto' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El título no puede superar los 100 caracteres' })
  title: string;

  @IsNotEmpty({ message: 'El contenido no puede estar vacío' })
  @IsString({ message: 'El contenido debe ser un texto' })
  @MinLength(1, { message: 'El contenido debe tener al menos 1 caracter' })
  @MaxLength(5000, { message: 'El contenido no puede superar los 5000 caracteres' })
  content: string;
}
