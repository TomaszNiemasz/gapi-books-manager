import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LibraryComponent} from './library/library.component';
import {MainSearcherComponent} from './main-searcher/main-searcher.component';
import {BookDetailsComponent} from './book-details/book-details.component';

const routes: Routes = [
  { path: 'main', component: MainSearcherComponent },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'library', component: LibraryComponent },
  { path: 'book/:id', component: BookDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
