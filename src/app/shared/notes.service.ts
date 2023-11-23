import { Injectable } from '@angular/core';
import { Note } from './note.module';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notes: Note[] = [];

  constructor() {
    this.loadNotesFromLocalStorage();
  }

  private loadNotesFromLocalStorage() {
    const storedNotes = localStorage.getItem('notes');
    this.notes = storedNotes ? JSON.parse(storedNotes) : [];
  }

  private saveNotesToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  getAll() {
    return this.notes;
  }

  get(id: number) {
    return this.notes[id];
  }

  getId(note: Note) {
    return this.notes.indexOf(note);
  }

  add(note: Note) {
    this.notes.push(note);
    this.saveNotesToLocalStorage();
    return this.notes.length - 1;
  }

  update(id: number, title: string, body: string) {
    let note = this.notes[id];
    note.title = title;
    note.body = body;
    this.saveNotesToLocalStorage();
  }

  delete(id: number) {
    this.notes.splice(id, 1);
    this.saveNotesToLocalStorage();
  }
}
