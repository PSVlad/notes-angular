import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations'
import { Note } from 'src/app/shared/note.module';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss'],
  animations: [
    trigger('itemAnim', [
      transition('void => *', [
        style({
          hight: 0,
          opacity: 0,
          transmorm: 'scale(.85)',
          margingBottom: 0,
          padding: 0
        }),
        animate(50, style({
          height: '*',
          margingBottom: '*',
          padding: '*'
        })),
        animate(100)
      ]),
      transition('* => void', [
        animate(50, style({
          transform: 'scale(1.05)'
        })),
        animate(50, style({
          transform: 'scale(1)',
          opacity: .75
        })),
        animate('120ms ease-out', style({
          transform: 'scale(.70)',
          opacity: 0
        })),
        animate('150ms ease-out', style({
          hight: 0,
          margingBottom: 0,
          padding: 0
        }))
      ])
    ]),
    trigger('listAnim', [
      transition('* => *', [
        query(':enter', [
          style({
            opacity: 0,
            height: 0
          }),
          stagger(100, [
            animate('0.2s ease')
          ])
        ], {
          optional: true
        }
        )
      ])
    ])
  ]
})
export class NoteListComponent implements OnInit {

  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();

  constructor(
    private notesServices: NotesService
  ) { }

  ngOnInit() { // Используйте правильное имя метода
    this.notes = this.notesServices.getAll();
    this.filteredNotes = this.notes;
  }

  delNote(id: number) {
    this.notesServices.delete(id);
  }

  filter(event: any) {
    let query = event.target.value;
    let allResults: Note[] = Array<Note>();

    query = query.toLowerCase().trim();

    let terms: string[] = query.split(' ');

    terms = this.removeDuplicates(terms);

    terms.forEach(term => {
      let results: Note[]  = this.relevantNotes(term);
      
      allResults = [...allResults, ...results]
    });

    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes = uniqueResults;


  }

  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();

    arr.forEach(e => uniqueResults.add(e));

    return Array.from(uniqueResults);
  }

  relevantNotes (query: string): Array<Note> {  
    query = query.toLowerCase().trim();

    let relevantNotes = this.notes.filter(note => {
      if (note.title && note.title.toLowerCase().includes(query)) {
        return true;
      }
      
      if (note.body && note.body.toLowerCase().includes(query)) {
        return true;
      }
      
      return false;
    })

    return relevantNotes;
  }
}
