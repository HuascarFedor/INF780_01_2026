import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import { NotesService } from './notes.service';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    findAll(): Note[];
    findOne(id: string): Note;
    create(createNoteDto: CreateNoteDto): Note;
    update(id: string, updateNoteDto: UpdateNoteDto): Note;
    remove(id: string): void;
}
