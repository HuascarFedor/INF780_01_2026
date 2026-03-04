import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  private notes: Note[] = [];

  findAll(): Note[] {
    return this.notes;
  }

  findOne(id: string): Note {
    const note = this.notes.find((n) => n.id === id);
    if (!note) {
      throw new NotFoundException(`Nota con id "${id}" no encontrada`);
    }
    return note;
  }

  create(createNoteDto: CreateNoteDto): Note {
    const note: Note = {
      id: uuidv4(),
      title: createNoteDto.title,
      content: createNoteDto.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.notes.push(note);
    return note;
  }

  update(id: string, updateNoteDto: UpdateNoteDto): Note {
    const note = this.findOne(id);
    if (updateNoteDto.title !== undefined) {
      note.title = updateNoteDto.title;
    }
    if (updateNoteDto.content !== undefined) {
      note.content = updateNoteDto.content;
    }
    note.updatedAt = new Date();
    return note;
  }

  remove(id: string): void {
    const index = this.notes.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new NotFoundException(`Nota con id "${id}" no encontrada`);
    }
    this.notes.splice(index, 1);
  }
}
