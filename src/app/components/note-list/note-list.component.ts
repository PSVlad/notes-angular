import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
          height: 0,
          opacity: 0,
          transform: 'scale(.85)',
          marginBottom: 0,
          paddingTop: 0
        }),
        animate(50, style({
          height: '*',
          marginBottom: '*',
          paddingTop: '*'
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
          height: 0,
          marginBottom: 0,
          paddingTop: 0
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

  @ViewChild('filterInput') filterInputElRef!: ElementRef<HTMLInputElement>;

  constructor(
    private notesService: NotesService
  ) { }

  ngOnInit() {
    this.notes = this.notesService.getAll();
    console.log('All notes:', this.notes);
    this.filter('');
  }

  generateNoteURL(note: Note) {
    let noteId = this.notesService.getId(note).toString();

    return noteId;
  }

  delNote(note: Note) {
    const noteId = this.notesService.getId(note);
    const index = this.notes.findIndex(n => this.notesService.getId(n) === noteId);
  
    if (index !== -1) {
      this.notes.splice(index, 1);
      // Pass undefined when calling filter outside of input event
      this.filter(undefined);
    }
  }

  filter(event: any) {
    let query = event?.target?.value || '';
    console.log('Filter query:', query);
    let allResults: Note[] = Array<Note>();

    query = query.toLowerCase().trim();

    let terms: string[] = query.split(' ');

    terms = this.removeDuplicates(terms);

    terms.forEach(term => {
      let results: Note[] = this.relevantNotes(term);

      allResults = [...allResults, ...results]
    });

    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes = uniqueResults;

    this.sortByRelevancy(allResults);

  }

  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();

    arr.forEach(e => uniqueResults.add(e));

    return Array.from(uniqueResults);
  }

  relevantNotes(query: string): Array<Note> {
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

  sortByRelevancy(searchResults: Note[]) {
    let noteCountObj: { [key: number]: number } = {}; // Явное указание типа

    searchResults.forEach(note => {
      let noteId = this.notesService.getId(note);

      if (noteCountObj[noteId]) {
        noteCountObj[noteId] += 1;
      } else {
        noteCountObj[noteId] = 1;
      }
    });

    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) => {
      let aId = this.notesService.getId(a);
      let bId = this.notesService.getId(b);

      let aCount = noteCountObj[aId];
      let bCount = noteCountObj[bId];


      return bCount - aCount;
    });
  }
}
