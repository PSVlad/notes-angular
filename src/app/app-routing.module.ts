import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { NoteListComponent } from './components';
import { NoteDetailsComponent } from './components/note-details/note-details.component';

const routes: Routes = [
  { path: '', component: MainLayoutComponent, children: [
    { path: '', component: NoteListComponent },
    { path: 'new', component: NoteDetailsComponent },
    { path: ':id', component: NoteDetailsComponent },
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
