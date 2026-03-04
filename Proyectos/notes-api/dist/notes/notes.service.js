"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let NotesService = class NotesService {
    constructor() {
        this.notes = [];
    }
    findAll() {
        return this.notes;
    }
    findOne(id) {
        const note = this.notes.find((n) => n.id === id);
        if (!note) {
            throw new common_1.NotFoundException(`Nota con id "${id}" no encontrada`);
        }
        return note;
    }
    create(createNoteDto) {
        const note = {
            id: (0, uuid_1.v4)(),
            title: createNoteDto.title,
            content: createNoteDto.content,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.notes.push(note);
        return note;
    }
    update(id, updateNoteDto) {
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
    remove(id) {
        const index = this.notes.findIndex((n) => n.id === id);
        if (index === -1) {
            throw new common_1.NotFoundException(`Nota con id "${id}" no encontrada`);
        }
        this.notes.splice(index, 1);
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)()
], NotesService);
//# sourceMappingURL=notes.service.js.map