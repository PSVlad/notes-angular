import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/shared/note.module';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {

  notes: Note[] = new Array<Note>();

  constructor (
    private notesServices: NotesService
  ) { }

  ngOnInit() { // Используйте правильное имя метода
    this.notes = this.notesServices.getAll();
  }

  delNote(id: number){
    this.notesServices.delete(id);
  }
}
