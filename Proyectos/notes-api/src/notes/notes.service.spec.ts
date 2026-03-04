import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesService } from './notes.service';

describe('NotesService', () => {
  let service: NotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesService],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  // ─── findAll ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('debe retornar un arreglo vacío si no hay notas', () => {
      const result = service.findAll();
      expect(result).toEqual([]);
    });

    it('debe retornar todas las notas creadas', () => {
      service.create({ title: 'Nota 1', content: 'Contenido 1' });
      service.create({ title: 'Nota 2', content: 'Contenido 2' });

      const result = service.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Nota 1');
      expect(result[1].title).toBe('Nota 2');
    });
  });

  // ─── findOne ────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('debe retornar una nota por su id', () => {
      const created = service.create({ title: 'Mi nota', content: 'Mi contenido' });
      const found = service.findOne(created.id);
      expect(found).toEqual(created);
    });

    it('debe lanzar NotFoundException si la nota no existe', () => {
      expect(() => service.findOne('id-inexistente')).toThrow(NotFoundException);
    });

    it('debe lanzar NotFoundException con el mensaje correcto', () => {
      expect(() => service.findOne('abc-123')).toThrow(
        'Nota con id "abc-123" no encontrada',
      );
    });
  });

  // ─── create ─────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('debe crear una nota con los datos proporcionados', () => {
      const dto: CreateNoteDto = { title: 'Nueva nota', content: 'Contenido nuevo' };
      const note = service.create(dto);

      expect(note.id).toBeDefined();
      expect(note.title).toBe(dto.title);
      expect(note.content).toBe(dto.content);
      expect(note.createdAt).toBeInstanceOf(Date);
      expect(note.updatedAt).toBeInstanceOf(Date);
    });

    it('debe asignar un id único a cada nota', () => {
      const nota1 = service.create({ title: 'Nota A', content: 'Contenido A' });
      const nota2 = service.create({ title: 'Nota B', content: 'Contenido B' });
      expect(nota1.id).not.toBe(nota2.id);
    });

    it('debe agregar la nota a la lista interna', () => {
      service.create({ title: 'Nota X', content: 'Contenido X' });
      expect(service.findAll()).toHaveLength(1);
    });
  });

  // ─── update ─────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('debe actualizar el título de una nota', () => {
      const created = service.create({ title: 'Original', content: 'Contenido' });
      const updated = service.update(created.id, { title: 'Actualizado' });
      expect(updated.title).toBe('Actualizado');
      expect(updated.content).toBe('Contenido');
    });

    it('debe actualizar el contenido de una nota', () => {
      const created = service.create({ title: 'Título', content: 'Viejo contenido' });
      const updated = service.update(created.id, { content: 'Nuevo contenido' });
      expect(updated.content).toBe('Nuevo contenido');
      expect(updated.title).toBe('Título');
    });

    it('debe actualizar título y contenido simultáneamente', () => {
      const created = service.create({ title: 'Título', content: 'Contenido' });
      const dto: UpdateNoteDto = { title: 'Nuevo título', content: 'Nuevo contenido' };
      const updated = service.update(created.id, dto);
      expect(updated.title).toBe('Nuevo título');
      expect(updated.content).toBe('Nuevo contenido');
    });

    it('debe actualizar updatedAt al modificar la nota', () => {
      const created = service.create({ title: 'Título', content: 'Contenido' });
      const fechaOriginal = created.updatedAt;
      const updated = service.update(created.id, { title: 'Cambiado' });
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(fechaOriginal.getTime());
    });

    it('debe lanzar NotFoundException si la nota a actualizar no existe', () => {
      expect(() => service.update('id-inexistente', { title: 'X' })).toThrow(
        NotFoundException,
      );
    });
  });

  // ─── remove ─────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('debe eliminar una nota existente', () => {
      const created = service.create({ title: 'Para borrar', content: 'Contenido' });
      service.remove(created.id);
      expect(service.findAll()).toHaveLength(0);
    });

    it('debe lanzar NotFoundException si la nota a eliminar no existe', () => {
      expect(() => service.remove('id-inexistente')).toThrow(NotFoundException);
    });

    it('debe lanzar NotFoundException con el mensaje correcto al eliminar', () => {
      expect(() => service.remove('xyz-789')).toThrow(
        'Nota con id "xyz-789" no encontrada',
      );
    });

    it('debe eliminar solo la nota indicada y mantener las demás', () => {
      const nota1 = service.create({ title: 'Nota 1', content: 'Contenido 1' });
      const nota2 = service.create({ title: 'Nota 2', content: 'Contenido 2' });

      service.remove(nota1.id);

      const notas = service.findAll();
      expect(notas).toHaveLength(1);
      expect(notas[0].id).toBe(nota2.id);
    });
  });
});
