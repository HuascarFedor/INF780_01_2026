import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

const mockNote = (overrides?: Partial<Note>): Note => ({
  id: 'uuid-1234',
  title: 'Nota de prueba',
  content: 'Contenido de prueba',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

const mockNotesService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('NotesController', () => {
  let controller: NotesController;
  let service: typeof mockNotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [{ provide: NotesService, useValue: mockNotesService }],
    }).compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get(NotesService);

    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  // ─── findAll ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('debe llamar a service.findAll y retornar la lista de notas', () => {
      const notes = [mockNote(), mockNote({ id: 'uuid-5678', title: 'Otra nota' })];
      service.findAll.mockReturnValue(notes);

      const result = controller.findAll();

      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(notes);
    });

    it('debe retornar un arreglo vacío cuando no hay notas', () => {
      service.findAll.mockReturnValue([]);

      const result = controller.findAll();

      expect(result).toEqual([]);
    });
  });

  // ─── findOne ────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('debe llamar a service.findOne con el id correcto y retornar la nota', () => {
      const note = mockNote();
      service.findOne.mockReturnValue(note);

      const result = controller.findOne('uuid-1234');

      expect(service.findOne).toHaveBeenCalledWith('uuid-1234');
      expect(result).toEqual(note);
    });

    it('debe propagar NotFoundException cuando la nota no existe', () => {
      service.findOne.mockImplementation(() => {
        throw new NotFoundException('Nota con id "inexistente" no encontrada');
      });

      expect(() => controller.findOne('inexistente')).toThrow(NotFoundException);
    });
  });

  // ─── create ─────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('debe llamar a service.create con el DTO y retornar la nota creada', () => {
      const dto: CreateNoteDto = { title: 'Nueva nota', content: 'Nuevo contenido' };
      const note = mockNote({ title: dto.title, content: dto.content });
      service.create.mockReturnValue(note);

      const result = controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(note);
    });

    it('debe retornar la nota con id y fechas generadas', () => {
      const dto: CreateNoteDto = { title: 'Nota con id', content: 'Contenido' };
      const note = mockNote();
      service.create.mockReturnValue(note);

      const result = controller.create(dto);

      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });

  // ─── update ─────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('debe llamar a service.update con id y DTO correctos', () => {
      const dto: UpdateNoteDto = { title: 'Título actualizado' };
      const updatedNote = mockNote({ title: 'Título actualizado' });
      service.update.mockReturnValue(updatedNote);

      const result = controller.update('uuid-1234', dto);

      expect(service.update).toHaveBeenCalledWith('uuid-1234', dto);
      expect(result.title).toBe('Título actualizado');
    });

    it('debe propagar NotFoundException cuando la nota a actualizar no existe', () => {
      service.update.mockImplementation(() => {
        throw new NotFoundException('Nota con id "inexistente" no encontrada');
      });

      expect(() => controller.update('inexistente', { title: 'X' })).toThrow(
        NotFoundException,
      );
    });
  });

  // ─── remove ─────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('debe llamar a service.remove con el id correcto', () => {
      service.remove.mockReturnValue(undefined);

      controller.remove('uuid-1234');

      expect(service.remove).toHaveBeenCalledWith('uuid-1234');
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('debe propagar NotFoundException cuando la nota a eliminar no existe', () => {
      service.remove.mockImplementation(() => {
        throw new NotFoundException('Nota con id "inexistente" no encontrada');
      });

      expect(() => controller.remove('inexistente')).toThrow(NotFoundException);
    });
  });
});
