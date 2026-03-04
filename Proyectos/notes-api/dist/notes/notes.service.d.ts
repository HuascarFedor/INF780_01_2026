import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
export declare class NotesService {
    private notes;
    findAll(): Note[];
    findOne(id: string): Note;
    create(createNoteDto: CreateNoteDto): Note;
    update(id: string, updateNoteDto: UpdateNoteDto): Note;
    remove(id: string): void;
}
